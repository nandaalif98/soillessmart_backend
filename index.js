const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { testConnection } = require("./database/db.js");
const Router = require("./Routes/index.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);

app.listen(process.env.APP_PORT || 5000, async () => {
  try {
    await testConnection();
    console.log(`Running at http://localhost:${process.env.APP_PORT || 5000}`);
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
});