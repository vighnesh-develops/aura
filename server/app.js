const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { openDatabase } = require("./db/database");
const { migrate } = require("./db/migrate");
const { createProductsRepo } = require("./db/productsRepo");
const { createUsersRepo } = require("./db/usersRepo");
const { createOrdersRepo } = require("./db/ordersRepo");
const { createContactRepo } = require("./db/contactRepo");
const { seedIfEmpty } = require("./db/seed");
const { createPublicRouter } = require("./routes/publicApi");
const { createAdminRouter } = require("./routes/adminApi");

function createApp() {
  const db = openDatabase();
  migrate(db);

  const productsRepo = createProductsRepo(db);
  const usersRepo = createUsersRepo(db);
  const ordersRepo = createOrdersRepo(db);
  const contactRepo = createContactRepo(db);

  seedIfEmpty(db, { productsRepo, usersRepo });

  const app = express();
  app.set("trust proxy", 1);

  const corsOrigin = (origin, cb) => {
    if (!origin) return cb(null, true);
    if (/^https?:\/\/localhost(?::\d+)?$/i.test(origin) || /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin)) {
      return cb(null, true);
    }
    const allow = process.env.FRONTEND_ORIGIN;
    if (allow && origin === allow) return cb(null, true);
    cb(null, false);
  };

  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  const sessionSecret = process.env.SESSION_SECRET || "dev-insecure-change-me";
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }

  app.use(
    session({
      name: "aurasound.sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(
    "/api",
    createPublicRouter({
      productsRepo,
      contactRepo,
      ordersRepo,
    })
  );

  app.use(
    "/admin/api",
    createAdminRouter({
      usersRepo,
      productsRepo,
      ordersRepo,
      contactRepo,
    })
  );

  app.use((req, res, next) => {
    const p = req.path || "";
    if (p.includes("..")) return res.status(400).end();
    const lower = p.toLowerCase();
    if (lower.startsWith("/server") || lower === "/.env" || lower.endsWith(".env")) {
      return res.status(404).end();
    }
    next();
  });

  const projectRoot = path.join(__dirname, "..");
  app.use(express.static(projectRoot, { extensions: ["html"] }));

  app.get("/admin", (_req, res) => {
    res.redirect("/admin/login.html");
  });
  app.use("/admin", express.static(path.join(__dirname, "admin-ui")));

  return app;
}

module.exports = { createApp };
