const express = require("express");
const bcrypt = require("bcrypt");
const { requireAdmin } = require("../middleware/requireAdmin");

function createAdminRouter({ usersRepo, productsRepo, ordersRepo, contactRepo }) {
  const r = express.Router();
  r.use(express.json());

  r.post("/login", (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = usersRepo.findByEmail(email);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  });

  r.post("/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("aurasound.sid", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      res.json({ ok: true });
    });
  });

  r.get("/me", (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ loggedIn: false });
    }
    res.json({ loggedIn: true, user: req.session.user });
  });

  r.use(requireAdmin);

  r.get("/dashboard", (_req, res) => {
    res.json({
      users: usersRepo.listSafe().length,
      products: productsRepo.count(),
      orders: ordersRepo.count(),
      unreadMessages: contactRepo.unread(),
    });
  });

  r.get("/users", (_req, res) => {
    res.json(usersRepo.listSafe());
  });

  r.get("/products", (_req, res) => {
    res.json(productsRepo.listPublic());
  });

  r.post("/products", (req, res) => {
    try {
      productsRepo.insert(req.body);
      const slug = String(req.body.slug || req.body.id || "").trim();
      res.status(201).json(productsRepo.getBySlug(slug));
    } catch (e) {
      const status = e.statusCode || (e.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 500);
      if (status === 500) console.error(e);
      res.status(status).json({ error: e.message || "Failed to create product" });
    }
  });

  r.put("/products/:slug", (req, res) => {
    try {
      productsRepo.update(req.params.slug, req.body);
      res.json(productsRepo.getBySlug(req.params.slug));
    } catch (e) {
      const status = e.statusCode || 500;
      if (status === 500) console.error(e);
      res.status(status).json({ error: e.message || "Failed to update" });
    }
  });

  r.delete("/products/:slug", (req, res) => {
    try {
      productsRepo.delete(req.params.slug);
      res.json({ ok: true });
    } catch (e) {
      const status = e.statusCode || 500;
      res.status(status).json({ error: e.message || "Failed to delete" });
    }
  });

  r.get("/orders", (_req, res) => {
    res.json(ordersRepo.listWithItems());
  });

  r.get("/messages", (_req, res) => {
    res.json(contactRepo.list());
  });

  r.patch("/messages/:id", (req, res) => {
    try {
      const read = Boolean(req.body?.read);
      contactRepo.setRead(Number(req.params.id), read);
      res.json({ ok: true });
    } catch (e) {
      res.status(e.statusCode || 500).json({ error: e.message });
    }
  });

  r.delete("/messages/:id", (req, res) => {
    try {
      contactRepo.remove(Number(req.params.id));
      res.json({ ok: true });
    } catch (e) {
      res.status(e.statusCode || 500).json({ error: e.message });
    }
  });

  return r;
}

module.exports = { createAdminRouter };
