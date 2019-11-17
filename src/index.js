const { Pool } = require('pg');
const connectionString = 'psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const pool = new Pool({ connectionString: connectionString });

app.use(bodyParser.text({ type: 'text/html' })); // principalement celui-ci.
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(bodyParser.json());

const oli = {
    "email" : "oli@gmail.com",
    "nom" : "Savoie",
    "prenom" : "Olivier",
    "telephone" : "(444)-555-6666",
    "status" : "P"
};

function getAllUsers(){
    const Query =   "SELECT * FROM Users";
    pool.connect();
    pool.query(Query, (err, res) => {
        console.log(err, res.rows);
        return (err, res);
    });
    pool.end();
}

function removeUser(email) {
    var state = 1;
    ;(async () => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'DELETE FROM Users * WHERE email = $1';
          const userValue = [email];
          await client.query(queryText, userValue);
          await client.query('COMMIT');
          state = 0;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => console.error(e.stack));
    return state;
}

function addUser(email, nom, prenom, telephone, status) {
    var state = 1;
    ;(async () => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'INSERT INTO Users(email, nom, prenom, telephone, status) VALUES($1, $2, $3, $4, $5)';
          const userValues = [email, nom, prenom, telephone, status];
          await client.query(queryText, userValues);
          await client.query('COMMIT');
          state = 0;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => console.error(e.stack));
    return state;
}

app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, PG'})
});

function errMessage(state) {
    if (state == 0){    
        return("\nTask completed succesfully.\n");
    } else {
        return("\nTask failed, rolling back. Modifications were reverted.\n");
    }
}

app.get('/adduser/:email/:nom/:prenom/:telephone/:status', function(req,res) {
    var email     = req.params.email;
    var nom       = req.params.nom;
    var prenom    = req.params.prenom;
    var telephone = req.params.telephone;
    var status    = req.params.status;
    var state = addUser(email, nom, prenom, telephone, status);
    res.end(errMessage(state));
  });

app.get('/removeuser/:email', function(req, res) {
    var email = req.params.email;
    var state = removeUser(email);
    res.end(errMessage(state));
})

app.get("/users", function(req,res) {
      res.end(getAllUsers());
})

app.listen(port, () => {
  console.log('Listening on port '+port+'.')
  });