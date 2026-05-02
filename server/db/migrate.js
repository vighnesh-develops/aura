function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      image_url TEXT NOT NULL,
      short_description TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      specs_json TEXT NOT NULL DEFAULT '[]',
      reviews_json TEXT NOT NULL DEFAULT '[]',
      discount_percent REAL DEFAULT 0,
      discount_amount REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      payment_method TEXT,
      payment_meta TEXT,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Order Placed',
      placed_at TEXT NOT NULL DEFAULT (datetime('now')),
      raw_json TEXT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_slug TEXT NOT NULL,
      product_name TEXT,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      line_total REAL NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read_flag INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_contact_unread ON contact_messages(read_flag);
  `);
}

module.exports = { migrate };
