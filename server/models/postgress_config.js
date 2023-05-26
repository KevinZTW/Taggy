
import { promisify } from "util";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Client } = require('pg')
const client = new Client()

client.connect()

// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// const promisifyQuery = promisify(connection.query).bind(connection);
const promisifyQuery = promisify(client.query).bind(client);


export { promisifyQuery as query, client };
