import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kai7717805",
  database: "TAGGY",
});
connection.connect();
