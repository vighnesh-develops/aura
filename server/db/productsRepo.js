function rowToPublic(row) {
  let specs;
  let reviews;
  try {
    specs = JSON.parse(row.specs_json || "[]");
  } catch {
    specs = [];
  }
  try {
    reviews = JSON.parse(row.reviews_json || "[]");
  } catch {
    reviews = [];
  }
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    price: row.price,
    rating: row.rating,
    category: row.category,
    brand: row.brand,
    image: row.image_url,
    shortDescription: row.short_description,
    description: row.description,
    specs,
    reviews,
    discountPercent: row.discount_percent ?? 0,
    discountAmount: row.discount_amount ?? null,
  };
}

function createProductsRepo(db) {
  const listStmt = db.prepare(
    `SELECT slug, name, price, rating, category, brand, image_url, short_description, description,
            specs_json, reviews_json, discount_percent, discount_amount
     FROM products ORDER BY name COLLATE NOCASE`
  );
  const bySlugStmt = db.prepare(
    `SELECT slug, name, price, rating, category, brand, image_url, short_description, description,
            specs_json, reviews_json, discount_percent, discount_amount
     FROM products WHERE slug = ?`
  );
  const insertStmt = db.prepare(
    `INSERT INTO products (slug, name, price, rating, category, brand, image_url, short_description, description,
                           specs_json, reviews_json, discount_percent, discount_amount, updated_at)
     VALUES (@slug, @name, @price, @rating, @category, @brand, @image_url, @short_description, @description,
             @specs_json, @reviews_json, @discount_percent, @discount_amount, datetime('now'))`
  );
  const updateStmt = db.prepare(
    `UPDATE products SET
       name = @name, price = @price, rating = @rating, category = @category, brand = @brand,
       image_url = @image_url, short_description = @short_description, description = @description,
       specs_json = @specs_json, reviews_json = @reviews_json,
       discount_percent = @discount_percent, discount_amount = @discount_amount,
       updated_at = datetime('now')
     WHERE slug = @slug`
  );
  const deleteStmt = db.prepare(`DELETE FROM products WHERE slug = ?`);
  const countStmt = db.prepare(`SELECT COUNT(*) AS n FROM products`);

  function normalizePayload(body) {
    const slug = String(body.slug || body.id || "").trim();
    const specs = Array.isArray(body.specs) ? body.specs : [];
    const reviews = Array.isArray(body.reviews) ? body.reviews : [];
    const price = Number(body.price);
    if (!Number.isFinite(price)) {
      const err = new Error("Invalid price");
      err.statusCode = 400;
      throw err;
    }
    return {
      slug,
      name: String(body.name || "").trim(),
      price,
      rating: Number(body.rating ?? 0),
      category: String(body.category || "").trim(),
      brand: String(body.brand || "").trim(),
      image_url: String(body.image || body.image_url || "").trim(),
      short_description: String(body.shortDescription ?? body.short_description ?? "").trim(),
      description: String(body.description ?? "").trim(),
      specs_json: JSON.stringify(specs),
      reviews_json: JSON.stringify(reviews),
      discount_percent:
        body.discountPercent != null ? Number(body.discountPercent) : Number(body.discount_percent ?? 0),
      discount_amount:
        body.discountAmount != null || body.discount_amount != null
          ? Number(body.discountAmount ?? body.discount_amount)
          : null,
    };
  }

  return {
    count() {
      return countStmt.get().n;
    },
    listPublic() {
      return listStmt.all().map(rowToPublic);
    },
    getBySlug(slug) {
      const row = bySlugStmt.get(slug);
      return row ? rowToPublic(row) : null;
    },
    insert(body) {
      const row = normalizePayload(body);
      if (!row.slug || !row.name) {
        const err = new Error("slug and name are required");
        err.statusCode = 400;
        throw err;
      }
      insertStmt.run(row);
      return bySlugStmt.get(row.slug);
    },
    update(slug, body) {
      const row = normalizePayload({ ...body, slug });
      if (!row.slug || !row.name) {
        const err = new Error("slug and name are required");
        err.statusCode = 400;
        throw err;
      }
      const info = updateStmt.run(row);
      if (info.changes === 0) {
        const err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }
      return bySlugStmt.get(slug);
    },
    delete(slug) {
      const info = deleteStmt.run(slug);
      if (info.changes === 0) {
        const err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }
    },
    upsertSeed(row) {
      const normalized = normalizePayload(row);
      const existing = bySlugStmt.get(normalized.slug);
      if (existing) {
        updateStmt.run(normalized);
      } else {
        insertStmt.run(normalized);
      }
    },
  };
}

module.exports = { createProductsRepo, rowToPublic };
