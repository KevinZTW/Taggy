import mysql from "mysql";
import { promisify } from "util";

export const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});
connection.connect((err) => {
  if (err) {
    console.log(err);
  }
});

const promisifyQuery = promisify(connection.query).bind(connection);

export { promisifyQuery as query };
