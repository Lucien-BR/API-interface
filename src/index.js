const { Pool } = require('pg');
const connectionString = 'psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: connectionString,
});

const user = [{email:'luc00110@gmail.com', nom:'Blais Regout', prenom:'Lucien', telephone:'(581)-998-5811', status:'A' }];

function getAllUsers(){
    pool.query('SELECT * FROM Users', (err, res) => {
        
        console.log(err, res.rows);
        //pool.end();
        return (err, res.rows);
    });

}

function addUser() {
    pool.query('INSERT INTO Users')

}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, PG'})
});

app.post('/plusone',function(req,res){
    var email     = req.body.email,
        nom       = req.body.nom,
        prenom    = req.body.password,
        telephone = req.body.telephone,
        status    = req.body.status;
    
    console.log("User name = "+user_name+", password is "+password);
    res.end("yes");
  });

  app.get("/users", function(req,res) {
        
        //user.push(req.body);
        res.json(getAllUsers());
  })


  app.listen(port, () => {
    console.log('Listening on port 3000.')
});