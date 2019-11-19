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
        {Default: 'Voici notre API!', routes: {
            GET: {
                Default: '/',
                Voir_Tout_Utilisateurs: '/users',
                Voir_Tout_Identifiants: '/creds',
                Voir_Tout_Evenements: '/events',
                Voir_Tout_Les_Equipes: '/teams'
            },
            POST: {
                Ajouter_Utilisateur: '/addUser/<email>/<nom>/<prenom>/<telephone>/<status>/<motDePasse>',
                Ajouter_Evenement: '/addEvent/<nomEvent>/<nomEcole>/<nbEquipes>/<dateDebut>/<dateFin>',
                Ajouter_Equipe: '/addTeam/<nomEquipe>/<nomEcole>/<nbJoueurs>',
                Metre_A_Jour_Utilisateur: '/updateUser/<email>/<nom>/<prenom>/<telephone>/<status>',
                Metre_A_Jour_Mot_De_Passe: '/updatePsw/<email>/<nouveauMotDePasse>',
                Metre_A_Jour_Evenement: "/updateEvent/<nomEvent>/<nomEcole>/<nbEquipes>/<dateDebut>/<dateFin>",
                Metre_A_Jour_Equipe: '/updateTeam/<nomEquipe>/<nomEcole>/<nbJoueurs>/<estInscrit>/<aPaye>/<etatDepot>',
                Retirer_Utilisateur: '/removeUser/<email>',
                Retirer_Evenement: '/removeEvent/<nomEvenement>',
                Retirer_Equipe: '/removeTeam/<nomEquipe>'
            }
        }
    })
});

// TODO: Un-Fuck les funcitons ajout Matchs, faire les updates, removes et delete.

app.get("/users", async (req,res) => {
    let pgRes       = await MyPG.getAllUsers();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ users: pgRes[1].rows });
});

app.get("/creds", async (req,res) => {
    let pgRes       = await MyPG.getAllCreds();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ credentials: pgRes[1].rows });
});

app.get('/events', async (req,res) => {
    let pgRes       = await MyPG.getAllEvents();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ events: pgRes[1].rows });
});

app.get('/teams', async (req,res) => {
    let pgRes       = await MyPG.getAllTeams();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ teams: pgRes[1].rows });
})

app.get('/matchs', async (req,res) => {
    let pgRes       = await MyPG.getAllMatchs();
    var code        = 200; // OK
    if (pgRes[0] != 0) { code = 400; } // Bad Request
    res.status(code).json({ matchs: pgRes[1].rows });
})

app.post('/addUser/:email/:nom/:prenom/:telephone/:status/:psw', async (req,res) => {
    var email       = req.params.email;
    var nom         = req.params.nom;
    var prenom      = req.params.prenom;
    var telephone   = req.params.telephone;
    var status      = req.params.status; // defaults to 'D'
    var psw         = req.params.psw;
    let pgRes       = await MyPG.addUser(email, nom, prenom, telephone, status);
    let pgRes2      = await MyPG.addCred(email, psw, status);
    var code        = 201; // Created
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406;} // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes2[1]); //.2 because it can't compile if the first one cannot.
});

app.post('/addEvent/:nomEvent/:nomEcole/:nbEquipes/:dateDebut/:dateFin', async (req,res) => {
    var nomEvent    = req.params.nomEvent;
    var nomEcole    = req.params.nomEcole;
    var nbEquipes   = req.params.nbEquipes;
    var dateDebut   = req.params.dateDebut;
    var dateFin     = req.params.dateFin;
    let pgRes       = await MyPG.addEvent(nomEvent, nomEcole, nbEquipes, dateDebut, dateFin);
    var code        = 201; // Created
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/addTeam/:nomEquipe/:nomEcole/:nbJoueurs', async (req,res) => {
    var nomEquipe   = req.params.nomEquipe;
    var nomEcole    = req.params.nomEcole;
    var nbJoueurs    = req.params.nbJoueurs;
    let pgRes       = await MyPG.addTeam(nomEquipe, nomEcole, nbJoueurs);
    var code        = 201; // Created
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/addMatchFull/:date/:lieu/:equipe1/:scoreEquipe1/:penalitesEquipe1/:equipe2/:scoreEquipe2/:penalitesEquipe2', async (req,res) => {
    var date        = req.params.date;
    var lieu        = req.params.lieu;
    var equipe1     = req.params.equipe1;
    var scEquipe1   = req.params.scoreEquipe1;
    var penEquipe1  = req.params.penalitesEquipe1;
    var equipe2     = req.params.equipe2;
    var scEquipe2   = req.params.scoreEquipe2;
    var penEquipe2  = req.params.penalitersEquipe2;
    let pgRes       = await MyPG.addMatchFull(date, lieu, equipe1, scEquipe1, penEquipe1, equipe2, scEquipe2, penEquipe2);
    var code        = 201; // Created
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/addMatchPart/:date/:lieu/:equipe1/:equipe2', async (req,res) => {
    var date        = req.params.date;
    var lieu        = req.params.lieu;
    var equipe1     = req.params.equipe1;
    var equipe2     = req.params.equipe2;
    let pgRes       = await MyPG.addMatchPart(date, lieu, equipe1, equipe2);
    var code        = 201; // Created
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
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

app.post('/updateUserStatus/:email/:status', async (req,res) => {
    var email       = req.params.email;
    var status      = req.params.status;
    let pgRes       = await MyPG.updateUserStatus(email, status);
    let pgRes2      = await MyPG.updateCredStatus(email, status);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 406; } // Not Acceptable
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

app.post('/updateEvent/:nomEvent/:nomEcole/:nbEquipes/:dateDebut/:dateFin', async (req,res) => {
    var nomEvent    = req.params.nomEvent;
    var nomEcole    = req.params.nomEcole;
    var nbEquipes   = req.params.nbEquipes;
    var dateDebut   = req.params.dateDebut;
    var dateFin     = req.params.dateFin;
    let pgRes       = await MyPG.updateEvent(nomEvent, nomEcole, nbEquipes, dateDebut, dateFin);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/updateTeam/:nomEquipe/:nomEcole/:nbJoueurs/:estInscrit/:aPaye/:etatDepot', async (req, res) => {
    var nomEquipe   = req.params.nomEquipe;
    var nomEcole    = req.params.nomEcole;
    var nbJoueurs   = req.params.nbJoueurs;
    var estInscrit  = req.params.estInscrit;
    var aPaye       = req.params.aPaye;
    var etatDepot   = req.params.etatDepot;
    let pgRes       = await MyPG.updateTeam(nomEquipe, nomEcole, nbJoueurs, estInscrit, aPaye, etatDepot);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 406; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/removeUser/:email', async (req, res) => {
    var email       = req.params.email;
    let pgRes       = await MyPG.removeCred(email);
    let pgRes2      = await MyPG.removeUser(email);
    var code        = 202; // Accepted
    if (pgRes[0] != 0 && pgRes2[0] != 0) { code = 409; } // Conflict
    res.status(code).end("\n "+code+" "+pgRes2[1]);
});

app.post('/removeEvent/:nomEvent', async (req,res) => {
    var nomEvent    = req.params.nomEvent;
    let pgRes       = await MyPG.removeEvent(nomEvent);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 409; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.post('/removeTeam/:nomEquipe', async (req,res) => {
    var nomEquipe    = req.params.nomEquipe;
    let pgRes       = await MyPG.removeTeam(nomEquipe);
    var code        = 202; // Accepted
    if (pgRes[0] != 0) { code = 409; } // Not Acceptable
    res.status(code).end("\n "+code+" "+pgRes[1]);
});

app.get('/*', (req,res) =>{
    res.status(501);
})

// Basicly allows this api to wait for requests.
app.listen(port, () => {
  console.log('Listening on http://localhost:'+port);
});