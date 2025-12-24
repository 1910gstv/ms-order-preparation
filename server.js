const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

server.on("error", (err) => {
  console.error(err);
});
