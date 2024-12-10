import mysql from "mysql2";
import "dotenv/config.js";

const pool = mysql.createPool({
  host: process.env.DATABASE_ENDPOINT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: "qna",
  port: 3306,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();
export default db;
