function createOrdersRepo(db) {
  const insertOrder = db.prepare(
    `INSERT INTO orders (public_id, customer_name, email, phone, address, payment_method, payment_meta, total, status, placed_at, raw_json)
     VALUES (@public_id, @customer_name, @email, @phone, @address, @payment_method, @payment_meta, @total, @status, @placed_at, @raw_json)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_slug, product_name, unit_price, quantity, line_total)
     VALUES (@order_id, @product_slug, @product_name, @unit_price, @quantity, @line_total)`
  );
  const listOrders = db.prepare(
    `SELECT id, public_id, customer_name, email, phone, address, payment_method, total, status, placed_at
     FROM orders ORDER BY datetime(placed_at) DESC`
  );
  const itemsForOrder = db.prepare(
    `SELECT product_slug, product_name, unit_price, quantity, line_total FROM order_items WHERE order_id = ?`
  );
  const count = db.prepare(`SELECT COUNT(*) AS n FROM orders`);

  return {
    count() {
      return count.get().n;
    },
    createFromPayload(payload) {
      const placedAt = payload.placedAt || new Date().toISOString();
      const transaction = db.transaction(() => {
        const info = insertOrder.run({
          public_id: payload.id || payload.public_id,
          customer_name: payload.customer || payload.customer_name || "Guest",
          email: payload.email || null,
          phone: payload.phone || null,
          address: payload.address || null,
          payment_method: payload.payment || payload.payment_method || null,
          payment_meta: JSON.stringify({
            paymentUpiId: payload.paymentUpiId,
            paymentApproved: payload.paymentApproved,
          }),
          total: Number(payload.total) || 0,
          status: payload.status || "Order Placed",
          placed_at: placedAt,
          raw_json: JSON.stringify(payload),
        });
        const orderId = info.lastInsertRowid;
        const items = Array.isArray(payload.items) ? payload.items : [];
        for (const line of items) {
          const qty = Number(line.quantity) || 1;
          const slug = line.id || line.slug || "unknown";
          const name = line.name || null;
          const unit = Number(line.unitPrice ?? line.price ?? line.unit_price ?? 0);
          const lineTotal = unit * qty;
          insertItem.run({
            order_id: orderId,
            product_slug: String(slug),
            product_name: name,
            unit_price: unit,
            quantity: qty,
            line_total: lineTotal,
          });
        }
        return orderId;
      });
      return transaction();
    },
    listWithItems() {
      const orders = listOrders.all();
      return orders.map((o) => ({
        ...o,
        items: itemsForOrder.all(o.id),
      }));
    },
  };
}

module.exports = { createOrdersRepo };
