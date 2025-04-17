import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
  // host: "localhost",    
  // user: "root",          
  // password: "root@123#",  
  // database: "db",       
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.NAME,
});

export default db;
