function createUsersRepo(db) {
  const byEmail = db.prepare(`SELECT id, email, password_hash, role, created_at FROM users WHERE email = ?`);
  const byId = db.prepare(`SELECT id, email, role, created_at FROM users WHERE id = ?`);
  const list = db.prepare(`SELECT id, email, role, created_at FROM users ORDER BY id ASC`);
  const insert = db.prepare(
    `INSERT INTO users (email, password_hash, role) VALUES (@email, @password_hash, @role)`
  );

  return {
    findByEmail(email) {
      return byEmail.get(email.trim().toLowerCase());
    },
    findById(id) {
      return byId.get(id);
    },
    listSafe() {
      return list.all();
    },
    create({ email, passwordHash, role }) {
      const info = insert.run({
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        role: role || "user",
      });
      return byId.get(info.lastInsertRowid);
    },
  };
}

module.exports = { createUsersRepo };
