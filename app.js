const express = require("express");
const app = express();
const cors = require("cors");

const http = require("./src/infra/http");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const { orderRoutes } = http();
app.use("/api", orderRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    err: {
      message: "Route not found",
    },
  });
});

module.exports = app;
