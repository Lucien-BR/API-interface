const MyPostgres    = require("./MyPostgres");
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 8080;

const MyPG = new MyPostgres();

app.use(bodyParser.text({ type: 'text/html' })); // Mainly this one
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(bodyParser.json());

// Do something with the default one.. idk
app.get('/', (request, response) => {
    response.status(200).json(
        {info: 'Voici notre API!', routes: {
            GET: {
                info: '/',
                Voir_Tout_Utilisateurs: '/users',
                Voir_Tout_Identifiants: '/creds'                
            },
            POST: {
                Ajouter_Utilisateur: '/adduser/<email>/<nom>/<prenom>/<telephone>/<status>/<motDePasse>',
                Metre_A_Jour_Utilisateur: '/updateuser/<email>/<nom>/<prenom>/<telephone>/<status>',
                Retirer_Utilisateur: '/removeuser/<email>',
                Changer_Mot_De_Passe: '/updatepsw/<email>/<nouveauMotDePasse>'
            }
        }
    })
});

app.get("/users", async (req,res) => {
    let pgRes = await MyPG.getAllUsers();
    var code        = 200;
    if (pgRes[0] != 0) { code = 400; }
    res.status(code).json({ users: pgRes[1].rows });
});

app.get("/creds", async (req,res) => {
    let pgRes = await MyPG.getAllCreds();
    var code        = 200;
    if (pgRes[0] != 0) { code = 400; }
    res.status(code).json({ users: pgRes[1].rows });
});

app.post('/adduser/:email/:nom/:prenom/:telephone/:status/:psw', async (req,res) => {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    var status      = req.params.status; // defaults to 'D'
    var psw         = req.params.psw;
    let pgRes       = await MyPG.addUser(email, nom, prenom, telephone, status);
    let pgRes2      = await MyPG.addCred(email, psw, status);
    var code        = 201;
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406;}
    res.status(code).end("\n"+code+" "+pgRes2[1]); //.2 because it can't compile if the first one cannot.
});

// NEVER modify the email. This api won't allow it.
app.post('/updateuser/:email/:nom/:prenom/:telephone/:status', async (req,res) => {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    var status      = req.params.status;
    let pgRes       = await MyPG.updateUser(email, nom, prenom, telephone, status);
    let pgRes2      = await MyPG.updateCredStatus(email, status);
    var code        = 202;
    if (pgRes[0] != 0 && pgRes2[0]) { code = 406; }
    res.status(code).end("\n"+code+" "+pgRes2[1]);
});

app.post('/updatepsw/:email/:psw', async (req,res) => {
    var email       = req.params.email;
    var psw         = req.params.psw;
    let pgRes       = await MyPG.updateCredPsw(email, psw);
    var code        = 202;
    if (pgRes[0] != 0) { code = 406; }
    res.status(code).end("\n"+code+" "+pgRes[1]);
});

app.post('/removeuser/:email', async (req, res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.removeCred(email);
    let pgRes2      = await MyPG.removeUser(email);
    var code        = 202;
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406; }
    res.status(code).end("\n"+code+" "+pgRes2[1]);
});

// Basicly allows this api to wait for requests.
app.listen(port, () => {
  console.log('Listening on http://localhost:'+port);
});