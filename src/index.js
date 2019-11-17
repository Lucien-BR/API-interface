const { Pool } = require('pg');
const connectionString = 'psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: connectionString,
});

function getAllUsers(){
    pool.query('SELECT * FROM Users', (err, res) => {
        console.log(err, res);
        pool.end();
    });
}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, PG'})
});

app.listen(port, () => {
    console.log('Listening on port 3000.')
});