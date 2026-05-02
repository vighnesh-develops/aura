const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

function loadSeedProducts(productsRepo) {
  const seedPath = path.join(__dirname, "..", "seed-products.json");
  if (!fs.existsSync(seedPath)) {
    return;
  }
  const raw = fs.readFileSync(seedPath, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) return;
  for (const item of items) {
    const slug = item.id || item.slug;
    if (!slug) continue;
    productsRepo.upsertSeed({
      slug,
      id: slug,
      ...item,
    });
  }
}

function seedAdmin(usersRepo) {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    console.warn("[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.");
    return;
  }
  const existing = usersRepo.findByEmail(email);
  if (existing) return;
  const hash = bcrypt.hashSync(password, 10);
  usersRepo.create({ email, passwordHash: hash, role: "admin" });
  console.info("[seed] Created admin user for", email);
}

function seedIfEmpty(db, repos) {
  const { productsRepo, usersRepo } = repos;
  if (productsRepo.count() === 0) {
    console.info("[seed] Products table empty — loading seed-products.json");
    loadSeedProducts(productsRepo);
  }
  seedAdmin(usersRepo);
}

module.exports = { loadSeedProducts, seedAdmin, seedIfEmpty };
