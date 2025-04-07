require('dotenv').config();
const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./Router/router");
const db = require('./Config/db')

app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
