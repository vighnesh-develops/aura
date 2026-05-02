const express = require("express");

function createPublicRouter({ productsRepo, contactRepo, ordersRepo }) {
  const r = express.Router();

  r.get("/products", (_req, res) => {
    res.json(productsRepo.listPublic());
  });

  r.get("/products/:slug", (req, res) => {
    const product = productsRepo.getBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(product);
  });

  r.post("/contact", (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "name, email, subject, and message are required" });
    }
    contactRepo.create({ name, email, subject, message });
    res.status(201).json({ ok: true });
  });

  r.post("/orders", (req, res) => {
    try {
      const body = req.body || {};
      if (!body.id || !Array.isArray(body.items)) {
        return res.status(400).json({ error: "id and items[] are required" });
      }
      const enriched = {
        ...body,
        items: body.items.map((line) => {
          const slug = line.id || line.slug;
          const p = slug ? productsRepo.getBySlug(String(slug)) : null;
          const unitPrice =
            line.unitPrice != null
              ? Number(line.unitPrice)
              : line.price != null
                ? Number(line.price)
                : p
                  ? Number(p.price)
                  : 0;
          return {
            ...line,
            id: slug,
            name: line.name || p?.name || null,
            unitPrice,
          };
        }),
      };
      ordersRepo.createFromPayload(enriched);
      res.status(201).json({ ok: true });
    } catch (e) {
      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({ error: "Order already recorded" });
      }
      console.error(e);
      res.status(500).json({ error: "Could not save order" });
    }
  });

  r.get("/orders", (_req, res) => {
    res.json(ordersRepo.listWithItems());
  });

  return r;
}

module.exports = { createPublicRouter };
