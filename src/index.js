//require('@google-cloud/debug-agent').start();
const jon           = require("../public/jon.json");
const MyPostgres    = require("./MyPostgres");
const express       = require('express');
const cors          = require('cors'); // cross-origin ressource sharing
const bodyParser    = require('body-parser');
const helmet        = require('helmet'); // http methods security
const app           = express();
const port          = 8080;
const MyPG          = new MyPostgres();

app.use(cors());
app.use(helmet());
app.use(bodyParser.text({ type: 'text/html' })); // Mainly this one
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(bodyParser.json());

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

app.use(express.static('public', options));



/*
** DEAFULT:BEGIN
*/
app.get('/', (request, response) => {
    response.status(200).sendFile('index.html', { root: './public' }); // cette ligne ci fonctionne bien.
});

app.get('/methods', (req,res) => {
    res.status(200).json([jon]);
})
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
    res.status(code).json([{ users: pgRes[1].rows }]);
});

app.get("/benevoles", async (req,res) => {
    let pgRes       = await MyPG.getAllBenevoles();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json([{ benevoles: pgRes[1].rows }]);
});

app.get('/getOneUser/:email', async (req,res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.getOneUser(email);
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json([{ user: pgRes[1].rows }]);
});

app.get('/getOneBenevole/:email', async (req,res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.getOneBenevole(email);
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json([{ benevole: pgRes[1].rows }]);
});

// TODO: DANS LE BACKEND, FAIRE EN SORTE QU'A L'AJOUT D'UN USER, 
// POUR QUE CA FASSE AUTOMATIQUEMENT /loggin APRES pour lastCon et l'adress IPv6
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
    res.status(code).end("res: "+code+" err: "+pgRes2[1]);
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
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/updateStatus/:email/:status', async (req,res) => {
    var email       = req.params.email;
    var status      = req.params.status;
    let pgRes       = await MyPG.updateUserStatus(email, status);
    let pgRes2      = await MyPG.updateCredStatus(email, status);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes2[1]);
});

app.post('/removeUser/:email', async (req, res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.removeCred(email);
    let pgRes2      = await MyPG.removeUser(email);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 409; } // Conflict
    res.status(code).end("res: "+code+" err: "+pgRes2[1]);
});

app.post('/updatePsw/:email/:psw', async (req,res) => {
    var email       = req.params.email;
    var psw         = req.params.psw;
    let pgRes       = await MyPG.updateCredPsw(email, psw);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});
/*
** USERS:END
*/



/*
** AUTHENTIFICATION:BEGIN
*/
app.get('/autoLogin/:ip', async (req,res) => {
    var ip          = req.params.ip;
    let pgRes       = await MyPG.autoLogin(ip);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ autoLoginStatus: pgRes[1] }]);
});

app.get('/login/:email/:psw/:ip', async (req,res) => {
    var email       = req.params.email;
    var psw         = req.params.psw;
    var ip          = req.params.ip;
    let pgRes       = await MyPG.login(email, psw, ip);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ loginStatus: pgRes[1] }]);
});
/*
** AUTHENTIFICATION:END
*/



/*
** EVENTS:BEGIN
*/
app.get('/events', async (req,res) => {
    let pgRes       = await MyPG.getAllEvents();
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ events: pgRes[1] }]);
});

app.get('/getOneEvent/:id', async (req,res) => {
    var id          = req.params.id;
    let pgRes       = await MyPG.getOneEvent(id);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ event: pgRes[1] }]);
});

app.post('/addEvent/:id/:nom/:lieu/:nb/:debut/:fin', async (req,res) => {
    var id          = req.params.id;
    var nom         = req.params.nom;
    var lieu        = req.params.lieu;
    var nb          = req.params.nb;
    var debut       = req.params.debut;
    var fin         = req.params.fin;
    let pgRes       = await MyPG.addEvent(id, nom, lieu, nb, debut, fin);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/updateEvent/:id/:nom/:lieu/:nb/:debut/:fin', async (req,res) => {
    var id          = req.params.id;
    var nom         = req.params.nom;
    var lieu        = req.params.lieu;
    var nb          = req.params.nb;
    var debut       = req.params.debut;
    var fin         = req.params.fin;
    let pgRes       = await MyPG.updateEvent(id, nom, lieu, nb, debut, fin);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/removeEvent/:id', async (req,res) => {
    var id          = req.params.id;
    let pgRes       = await MyPG.removeEvent(id);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});
/*
** EVENTS:END
*/



/**
 * TEAMS:BEGIN
 */
app.get('/teams', async (req,res) => {
    let pgRes       = await MyPG.getAllTeams();
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ teams: pgRes[1] }]);
});

app.get('/getOneTeam/:id', async (req,res) => {
    var id          = req.params.id;
    let pgRes       = await MyPG.getOneTeam(id);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ team: pgRes[1] }]);
});

app.post('/addTeam/:id/:nom/:ecole/:nb/:coach/:cell/:email', async (req,res) => {
    var id          = req.params.id;
    var nom         = req.params.nom;
    var ecole       = req.params.ecole;
    var nb          = req.params.nb;
    var coach       = req.params.coach;
    var cell        = req.params.cell;
    var email       = req.params.email;
    let pgRes       = await MyPG.addTeam(id, nom, ecole, nb, coach, cell, email);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/updateTeam/:id/:nom/:ecole/:nb/:coach/:cell/:email', async (req,res) => {
    var id          = req.params.id;
    var nom         = req.params.nom;
    var ecole       = req.params.ecole;
    var nb          = req.params.nb;
    var coach       = req.params.coach;
    var cell        = req.params.cell;
    var email       = req.params.email;
    let pgRes       = await MyPG.updateTeam(id, nom, ecole, nb, coach, cell, email);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/removeTeam/:id', async (req,res) => {
    var id          = req.params.id;
    let pgRes       = await MyPG.removeTeam(id);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});
/**
 * TEAMS:END
 */



/**
 * EVENT-TEAMS:BEGIN
 */
app.get('/getAllEventTeams/:idEvent', async (req,res) => {
    var idEvent     = req.params.idEvent;
    let pgRes       = await MyPG.getAllEventTeams(idEvent);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ event_teams: pgRes[1] }]);
});

app.get('/getEventLeaderboard/:idEvent', async (req,res) => {
    var idEvent     = req.params.idEvent;
    let pgRes       = await MyPG.getEventLeaderboard(idEvent);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).json([{ leaderboard: pgRes[1] }]);
});

app.post('/addTeamToEvent/:idEvent/:idTeam', async (req,res) => {
    var idEvent     = req.params.idEvent;
    var idTeam      = req.params.idTeam;
    let pgRes       = await MyPG.addTeamToEvent(idEvent, idTeam);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/updateTeamStatus/:idEvent/:idTeam/:estInscrit/:aPaye/:statusDepot', async (req,res) => {
    var idEvent     = req.params.idEvent;
    var idTeam      = req.params.idTeam;
    var estInscrit  = req.params.estInscrit;
    var aPaye       = req.params.aPaye;
    var statusDepot = req.params.statusDepot;
    let pgRes       = await MyPG.updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, statusDepot);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/updateTeamScore/:idEvent/:idTeam/:win/:lose/:penalites', async (req,res) => {
    var idEvent     = req.params.idEvent;
    var idTeam      = req.params.idTeam;
    var win         = req.params.win;
    var lose        = req.params.lose;
    var penalites   = req.params.penalites;
    let pgRes       = await MyPG.updateTeamScore(idEvent, idTeam, win, lose, penalites);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});

app.post('/removeTeamFromEvent/:idEvent/:idTeam', async (req, res) => {
    var idEvent     = req.params.idEvent;
    var idTeam      = req.params.idTeam;
    let pgRes       = await MyPG.removeTeamFromEvent(idEvent, idTeam);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("res: "+code+" err: "+pgRes[1]);
});
/**
 * EVENT-TEAMS:END
 */



/*
** CRITICALS:BEGIN
*/
app.get('/*', (req,res) =>{
    res.status(501);
});

// Basicly allows this api to wait for requests.
app.listen(port, () => {
  console.log('Listening on http://localhost:'+port);
});
/*
** CRITICALS:END
*/

/**
 * END OF FILE
 */