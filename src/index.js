const MyPostgres    = require("./MyPostgres");
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 3000;

const MyPG = new MyPostgres();

app.use(bodyParser.text({ type: 'text/html' })); // principalement celui-ci.
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(bodyParser.json());
// Ne pas confondre err/res du module EXPRESS avec ceux du modul PG

// Faire dequoi avec le default one.. idk
app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, PG'})
});

app.get("/users", function(req,res) {
    res.end(MyPG.getAllUsers());
});

app.get('/adduser/:email/:nom/:prenom/:telephone/:status', function(req,res) {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    var status      = req.params.status;
    var state       = MyPG.addUser(email, nom, prenom, telephone, status);
    res.end(MyPG.errMessage(state));
});

app.get('/removeuser/:email', function(req, res) {
    var email       = req.params.email;
    var state       = MyPG.removeUser(email);
    res.end(MyPG.errMessage(state));
});

app.listen(port, () => {
  console.log('Listening on port '+port+'.')
});