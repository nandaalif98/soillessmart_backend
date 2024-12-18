const mysql2 = require("mysql2/promise");
require ('dotenv').config();

const db = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function testConnection() {
  try {
    await db.getConnection();
    console.log("Connection Database Succses :)");
  } catch (error) {
    console.error("Database Connection Failed", error);
  }
}

async function query(command, values) {
  try {
    const [value] = await db.query(command, values ?? []);
    return value;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { db, testConnection, query };
