require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { createApp } = require("./app");

const port = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(port, () => {
  console.info(`AURASOUND API listening on http://localhost:${port}`);
  console.info(`Admin UI: http://localhost:${port}/admin/login.html`);
});
