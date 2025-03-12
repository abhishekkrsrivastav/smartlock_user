import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
  // host: "localhost",    
  // user: "root",          
  // password: "root@123#",  
  // database: "db",       
  host: "151.106.103.101",
  user: "webinfinity_slock",
  password: "8a?[{-5Nno8n",
  database: "webinfinity_smartlock",
});

export default db;
