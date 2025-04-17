require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./Router/router");
const db = require('./Config/db');
const { setupSocket } = require('./socket');

app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors({
  "Access-Control-Allow-Origin": "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  "Access-Control-Allow-Headers":
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
}));
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
  });
});

app.use('/',router);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
setupSocket(server);
console.log("Socket setup complete");