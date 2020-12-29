import mysql from "mysql";
import { promisify } from "util";

export const connection = mysql.createConnection({
  host: "taggy.cgz6ycgxcj9j.ap-northeast-1.rds.amazonaws.com",
  user: "admin",
  password: "kai7717805",
  database: "TAGGY",
});
connection.connect((err) => {
  if (err) {
    console.log(err);
  }
});

const promisifyQuery = promisify(connection.query).bind(connection);

export { promisifyQuery as query };
