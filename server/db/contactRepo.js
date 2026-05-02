function createContactRepo(db) {
  const insert = db.prepare(
    `INSERT INTO contact_messages (name, email, subject, message) VALUES (@name, @email, @subject, @message)`
  );
  const list = db.prepare(
    `SELECT id, name, email, subject, message, read_flag, created_at FROM contact_messages ORDER BY datetime(created_at) DESC`
  );
  const unreadCount = db.prepare(`SELECT COUNT(*) AS n FROM contact_messages WHERE read_flag = 0`);
  const markRead = db.prepare(`UPDATE contact_messages SET read_flag = ? WHERE id = ?`);
  const deleteMsg = db.prepare(`DELETE FROM contact_messages WHERE id = ?`);

  return {
    create(row) {
      insert.run({
        name: String(row.name || "").trim(),
        email: String(row.email || "").trim(),
        subject: String(row.subject || "").trim(),
        message: String(row.message || "").trim(),
      });
    },
    list() {
      return list.all();
    },
    unread() {
      return unreadCount.get().n;
    },
    setRead(id, read) {
      const info = markRead.run(read ? 1 : 0, id);
      if (info.changes === 0) {
        const err = new Error("Message not found");
        err.statusCode = 404;
        throw err;
      }
    },
    remove(id) {
      const info = deleteMsg.run(id);
      if (info.changes === 0) {
        const err = new Error("Message not found");
        err.statusCode = 404;
        throw err;
      }
    },
  };
}

module.exports = { createContactRepo };
