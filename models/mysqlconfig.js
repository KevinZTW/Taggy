import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kai7717805?",
  database: "TAGGY",
});
connection.connect();
