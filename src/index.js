const MyPostgres    = require("./MyPostgres");
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 8080;

const MyPG = new MyPostgres();

app.use(bodyParser.text({ type: 'text/html' })); // Mainly this one
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(bodyParser.json());



/*
** DEAFULT:BEGIN
*/
app.get('/', (request, response) => {
    response.status(200).json(
        { // TODO: UPDATE THIS
            Default: '/',
            Info: 'Voici notre API!',
            Routes: '/gateways/<parameters>',
            Tables: {
                Classes: 'Methods',
                Users: {
                    GET:{
                        Voir_Tout_Utilisateurs: '/users'
                    },
                    POST:{
                        Ajouter_Utilisateur: '/addUser/<email>/<nom>/<prenom>/<telephone>/<status>/<motDePasse>',
                        Metre_A_Jour_Utilisateur: '/updateUser/<email>/<nom>/<prenom>/<telephone>/<status>', 
                        Metre_A_Jour_Status: '/updateStatus/<email>/<status>',
                        Retirer_Utilisateur: '/removeUser/<email>'
                    }
                },
                Credentials: {
                    GET: {
                        Voir_Tout_Identifiants: '/creds'
                    },
                    POST: {
                        Metre_A_Jour_Mot_De_Passe: '/updatePsw/<email>/<nouveauMotDePasse>',
                    }
                }
            }
        }
    )
});
/*
** DEFAULT:END
*/



/*
** USERS:BEGIN
*/
app.get("/users", async (req,res) => {
    let pgRes       = await MyPG.getAllUsers();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ users: pgRes[1].rows });
});

app.post('/addUser/:email/:nom/:prenom/:telephone/:status/:psw', async (req,res) => {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    var status      = req.params.status;
    var psw         = req.params.psw;
    let pgRes       = await MyPG.addUser(email, nom, prenom, telephone, status);
    let pgRes2      = await MyPG.addCred(email, psw, status);
    var code        = 201; // Created
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406;} // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes2[1]);
});

// NEVER modify the email. This api won't allow it.
app.post('/updateUser/:email/:nom/:prenom/:telephone', async (req,res) => {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    let pgRes       = await MyPG.updateUser(email, nom, prenom, telephone);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/updateStatus/:email/:status', async (req,res) => {
    var email       = req.params.email;
    var status      = req.params.status;
    let pgRes       = await MyPG.updateUserStatus(email, status);
    let pgRes2      = await MyPG.updateCredStatus(email, status);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes2[1]);
});

app.post('/removeUser/:email', async (req, res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.removeCred(email);
    let pgRes2      = await MyPG.removeUser(email);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 409; } // Conflict
    res.status(code).end("\n "+code+" "+pgRes2[1]);
});

app.post('/updatePsw/:email/:psw', async (req,res) => {
    var email       = req.params.email;
    var psw         = req.params.psw;
    let pgRes       = await MyPG.updateCredPsw(email, psw);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

/*
** USERS:END
*/



/*
** CREDENTIALS:BEGIN
*/
app.post('/autoLogin/:ip', async (req,res) => {
    var ip          = req.params.ip;
    let pgRes       = await MyPG.autoLogin(ip);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json(pgRes[1]);
});

app.post('/login/:email/:psw/:ip', async (req,res) => {
    var email       = req.params.email;
    var psw         = req.params.psw;
    var ip          = req.params.ip;
    let pgRes       = await MyPG.login(email, psw, ip);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json(pgRes[1]);
});
/*
** CREDENTIALS:END
*/

/**
 * TODO: TEMP A EFFACER ET DANS MYPOSTGRES.JS ET DANS CREDS.JS
 */
app.get("/creds", async (req,res) => {
    let pgRes       = await MyPG.getAllCreds();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ users: pgRes[1].rows });
});


/*
** CRITICALS:BEGIN
*/
app.get('/*', (req,res) =>{
    res.status(501);
})

// Basicly allows this api to wait for requests.
app.listen(port, () => {
  console.log('Listening on http://localhost:'+port);
});
/*
** CRITICALS:END
*/