import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "social"
});
db.connect((err) => {
   if (err) {
       console.error('Error connecting to MySQL database:', err);
       return;
   }
   console.log('Connected to MySQL database');
});

// Export the db connection
export default db;


