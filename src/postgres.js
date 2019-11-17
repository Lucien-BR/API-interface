import { Pool, Client } from 'pg';
const connectionString = 'psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-dn';


const pool = new Pool({
    connectionString: connectionString,
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});

const client = new Client({
    connectionString: connectionString,
});
client.connect();

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    client.end();
})