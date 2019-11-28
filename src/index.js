//require("@google-cloud/debug-agent").start(); // gcloud app deploy --version=1-24 --promote --stop-previous-version
const jon         = require("../public/jon.json");
const MyPostgres  = require("./MyPostgres");
const express     = require("express");
const cors        = require("cors"); // cross-origin ressource sharing
const bodyParser  = require("body-parser");
const helmet      = require("helmet"); // http methods security
const app         = express();
const port        = 8080;
const MyPG        = new MyPostgres();

const sleep       = m => new Promise(r => setTimeout(r, m));

app.use(cors());
app.use(helmet());
app.use(bodyParser.text({ type: "text/html" })); // Mainly this one
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  setHeaders: function(res, path, stat) {
    res.set("x-timestamp", Date.now());
  }
};

app.use(express.static("public", options));



/*
 ** DEAFULT:BEGIN
 */
app.get("/", (request, response) => {
  response.status(200).sendFile("index.html", { root: "./public" }); // cette ligne ci fonctionne bien.
});

app.get("/methods", (req, res) => {
  res.status(200).json([jon]);
});
/*
 ** DEFAULT:END
 */



/*
 ** USERS:BEGIN
 */
app.get("/users", async (req, res) => {
  let pgRes       = await MyPG.getAllUsers();
  var code        = 200; // OK
  res.status(code).json([{ users: pgRes }]);
});

app.get("/benevoles", async (req, res) => {
  let pgRes       = await MyPG.getAllBenevoles();
  var code        = 200; // OK
  res.status(code).json([{ benevoles: pgRes }]);
});

app.get("/getOneUser/:email", async (req, res) => {
  var email       = req.params.email;
  let pgRes       = await MyPG.getOneUser(email);
  var code        = 200; // OK
  res.status(code).json([{ user: pgRes }]);
});

app.get("/getBenevoleDemandes", async (req, res) => {
  let pgRes       = await MyPG.getBenevoleDemandes();
  var code        = 200; // OK
  res.status(code).json([{ demandes: pgRes }]);
});

// TODO: DANS LE BACKEND, FAIRE EN SORTE QU'A L'AJOUT D'UN USER,
// POUR QUE CA FASSE AUTOMATIQUEMENT /loggin APRES pour lastCon et l'adress IPv6
app.post("/addUser/:email/:nom/:prenom/:telephone/:status/:psw/:Q1/:R1",async (req, res) => {
    var email     = req.params.email;
    var nom       = req.params.nom;
    var prenom    = req.params.prenom;
    var telephone = req.params.telephone;
    var status    = req.params.status;
    var psw       = req.params.psw;
    var Q1        = req.params.Q1;
    var R1        = req.params.R1;
    let pgRes     = await MyPG.addUser(email, nom, prenom, telephone, status);
    console.time("Slept for"); // set time
    await sleep(500); // was way to fast for some reasons..
    console.timeEnd("Slept for"); // show time
    let pgRes2    = await MyPG.addCred(email, psw, status, Q1, R1);
    var code      = 201; // Created
    if (pgRes != null && pgRes2 != null) {
      code = 406;
    } // Not Acceptable
    res.status(code).end([{ res: code, err: pgRes + pgRes2 }]);
  }
);

// NEVER modify the email. This api won't allow it.
app.post("/updateUser/:email/:nom/:prenom/:telephone", async (req, res) => {
  var email       = req.params.email;
  var nom         = req.params.nom;
  var prenom      = req.params.prenom;
  var telephone   = req.params.telephone;
  let pgRes       = await MyPG.updateUser(email, nom, prenom, telephone);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code = 406;
  } // Not Acceptable
  res.status(code).json([{ res: code, err: pgRes }]);
});

app.post("/updateStatus/:email/:status", async (req, res) => {
  var email       = req.params.email;
  var status      = req.params.status;
  let pgRes       = await MyPG.updateUserStatus(email, status);
  let pgRes2      = await MyPG.updateCredStatus(email, status);
  var code        = 202; // Accepted
  if (pgRes != null && pgRes2 != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).end([{ res: code, err: pgRes + pgRes2 }]);
});

app.post("/removeUser/:email", async (req, res) => {
  var email       = req.params.email;
  let pgRes       = await MyPG.removeCred(email);
  let pgRes2      = await MyPG.removeUser(email);
  var code        = 202; // Accepted
  if (pgRes[0] != null && pgRes2[0] != null) {
    code          = 409;
  } // Conflict
  res.status(code).end([{ res: code, err: pgRes + pgRes2 }]);
});

app.post("/updatePsw/:email/:psw", async (req, res) => {
  var email       = req.params.email;
  var psw         = req.params.psw;
  let pgRes       = await MyPG.updateCredPsw(email, psw);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/*
 ** USERS:END
 */



/*
 ** AUTHENTIFICATION:BEGIN
 */
app.get("/autoLogin/:ip", async (req, res) => {
  var ip          = req.params.ip;
  let pgRes       = await MyPG.autoLogin(ip);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ autoLoginStatus: pgRes }]);
});

app.get("/login/:email/:psw/:ip", async (req, res) => {
  var email       = req.params.email;
  var psw         = req.params.psw;
  var ip          = req.params.ip;
  let pgRes       = await MyPG.login(email, psw, ip);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ loginStatus: pgRes }]);
});

app.get("/login2/:email/:psw", async (req, res) => {
  var email       = req.params.email;
  var psw         = req.params.psw;
  let pgRes       = await MyPG.login2(email, psw);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ loginStatus: pgRes, status: code }]);
});

app.get("/gimmeQR/:email", async (req, res) => {
  var email       = req.params.email;
  var R1          = req.params.R1;
  let pgRes       = await MyPG.gimmeQR(email, R1);
  var code        = 200; // OK
  res.status(code).json(pgRes);
});
/*
 ** AUTHENTIFICATION:END
 */

/*
 ** EVENTS:BEGIN
 */
app.get("/events", async (req, res) => {
  let pgRes       = await MyPG.getAllEvents();
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ events: pgRes }]);
});

app.get("/getOneEvent/:id", async (req, res) => {
  var id          = req.params.id;
  let pgRes       = await MyPG.getOneEvent(id);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ event: pgRes }]);
});

app.post("/addEvent/:id/:nom/:lieu/:nb/:debut/:fin", async (req, res) => {
  var id          = req.params.id;
  var nom         = req.params.nom;
  var lieu        = req.params.lieu;
  var nb          = req.params.nb;
  var debut       = req.params.debut;
  var fin         = req.params.fin;
  let pgRes       = await MyPG.addEvent(id, nom, lieu, nb, debut, fin);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});

app.post("/updateEvent/:id/:nom/:lieu/:nb/:debut/:fin", async (req, res) => {
  var id          = req.params.id;
  var nom         = req.params.nom;
  var lieu        = req.params.lieu;
  var nb          = req.params.nb;
  var debut       = req.params.debut;
  var fin         = req.params.fin;
  let pgRes       = await MyPG.updateEvent(id, nom, lieu, nb, debut, fin);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});

app.post("/removeEvent/:id", async (req, res) => {
  var id          = req.params.id;
  let pgRes       = await MyPG.removeEvent(id);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/*
 ** EVENTS:END
 */

/**
 * TEAMS:BEGIN
 */
app.get("/teams", async (req, res) => {
  let pgRes       = await MyPG.getAllTeams();
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ teams: pgRes }]);
});

app.get("/getOneTeam/:id", async (req, res) => {
  var id          = req.params.id;
  let pgRes       = await MyPG.getOneTeam(id);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ team: pgRes }]);
});

app.post(
  "/addTeam/:id/:nom/:ecole/:nb/:coach/:cell/:email",
  async (req, res) => {
    var id        = req.params.id;
    var nom       = req.params.nom;
    var ecole     = req.params.ecole;
    var nb        = req.params.nb;
    var coach     = req.params.coach;
    var cell      = req.params.cell;
    var email     = req.params.email;
    let pgRes     = await MyPG.addTeam(id, nom, ecole, nb, coach, cell, email);
    var code      = 202; // Accepted
    if (pgRes != null) {
      code = 406;
    } // Not Acceptable
    res.status(code).json([{ res: code, err: pgRes }]);
  }
);

app.post(
  "/updateTeam/:id/:nom/:ecole/:nb/:coach/:cell/:email",
  async (req, res) => {
    var id        = req.params.id;
    var nom       = req.params.nom;
    var ecole     = req.params.ecole;
    var nb        = req.params.nb;
    var coach     = req.params.coach;
    var cell      = req.params.cell;
    var email     = req.params.email;
    let pgRes     = await MyPG.updateTeam(id, nom, ecole, nb, coach, cell, email);
    var code      = 202; // Accepted
    if (pgRes != null) {
      code        = 406;
    } // Not Acceptable
    res.status(code).json([{ res: code, err: pgRes }]);
  }
);

app.post("/removeTeam/:id", async (req, res) => {
  var id          = req.params.id;
  let pgRes       = await MyPG.removeTeam(id);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/**
 * TEAMS:END
 */

/**
 * EVENT-TEAMS:BEGIN
 */
app.get("/getAllEventTeams/:idEvent", async (req, res) => {
  var idEvent     = req.params.idEvent;
  let pgRes       = await MyPG.getAllEventTeams(idEvent);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ event_teams: pgRes }]);
});

app.get("/getEventLeaderboard/:idEvent", async (req, res) => {
  var idEvent     = req.params.idEvent;
  let pgRes       = await MyPG.getEventLeaderboard(idEvent);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ leaderboard: pgRes }]);
});

app.post("/addTeamToEvent/:idEvent/:idTeam", async (req, res) => {
  var idEvent     = req.params.idEvent;
  var idTeam      = req.params.idTeam;
  let pgRes       = await MyPG.addTeamToEvent(idEvent, idTeam);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});

app.post(
  "/updateTeamStatus/:idEvent/:idTeam/:estInscrit/:aPaye/:statusDepot",
  async (req, res) => {
    var idEvent   = req.params.idEvent;
    var idTeam    = req.params.idTeam;
    var estInscrit= req.params.estInscrit;
    var aPaye     = req.params.aPaye;
    var statusDepot = req.params.statusDepot;
    let pgRes     = await MyPG.updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, statusDepot);
    var code = 202; // Accepted
    if (pgRes != null) {
      code = 406;
    } // Not Acceptable
    res.status(code).json([{ res: code, err: pgRes }]);
  }
);

app.post("/removeTeamFromEvent/:idEvent/:idTeam", async (req, res) => {
  var idEvent     = req.params.idEvent;
  var idTeam      = req.params.idTeam;
  let pgRes       = await MyPG.removeTeamFromEvent(idEvent, idTeam);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/**
 * EVENT-TEAMS:END
 */



/**
 * MATCHS:BEGIN
 */
app.get("/getAllEventMatchs/:idEvent", async (req, res) => {
  var idEvent     = req.params.idEvent;
  let pgRes       = await MyPG.getAllEventMatchs(idEvent);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ eventMatchs: pgRes }]);
});

app.get("/getOneMatch/:idMatch", async (req, res) => {
  var idMatch     = req.params.idMatch;
  let pgRes       = await MyPG.getOneMatch(idMatch);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ match: pgRes }]);
});

app.get("/getOneTeamEventMatchs/:idEvent/:idTeam", async (req, res) => {
  var idEvent     = req.params.idEvent;
  var idTeam     = req.params.idTeam;
  let pgRes       = await MyPG.getOneTeamEventMatchs(idEvent, idTeam);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ teamMatchs: pgRes }]);
});

app.post(
  "/addMatchToEvent/:idMatch/:idEvent/:idTeamA/:idTeamB/:terrain/:date",
  async (req, res) => {
    var idEvent   = req.params.idEvent;
    var idMatch   = req.params.idMatch;
    var idTeamA   = req.params.idTeamA;
    var idTeamB   = req.params.idTeamB;
    var terrain   = req.params.terrain;
    var date      = req.params.date;
    let pgRes     = await MyPG.addMatchToEvent(idMatch, idEvent, idTeamA, idTeamB, terrain, date);
    var code      = 202; // Accepted
    if (pgRes != null) {
      code        = 406;
    } // Not Acceptable
    res.status(code).json([{ res: code, err: pgRes }]);
  } 
);

app.post("/updateEventMatchInfo/:idMatch/:terrain/:date", async (req, res) => {
  var idMatch     = req.params.idMatch;
  var terrain     = req.params.terrain;
  var date        = req.params.date;
  let pgRes       = await MyPG.updateEventMatchInfo(idMatch, terrain, date);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});

/**
 * Big one. compiling scores at the end of a match. Only achieve this once per match.
 * THIS IS NOT AN UPDATE COMMAND (https://i.kym-cdn.com/entries/icons/original/000/028/596/dsmGaKWMeHXe9QuJtq_ys30PNfTGnMsRuHuo_MUzGCg.jpg)
 * Not restraining this command to once per match for debugging purposes
 * -- TESTED AND OPERATIONAL --
 * refered in Mypostgres.js and Matchs.js as updateEventMatchScore()
 */
app.post("/compileMatchScore/:idMatch/:pointsA/:penalitesA/:pointsB/:penalitesB/:overtime",
  async (req, res) => {
    let specialRes = await MyPG.wasEventMatchUpdated(idMatch); // double checks for previous updates
    var idMatch   = req.params.idMatch;
    var pointsA   = req.params.pointsA;
    var penalitesA= req.params.penalitesA;
    var pointsB   = req.params.pointsB;
    var penalitesB= req.params.penalitesB;
    var overtime  = req.params.overtime;
    let pgRes     = await MyPG.updateEventMatchScore(idMatch, pointsA, penalitesA, pointsB, penalitesB); 
    // this is the firs update refered in a comment
    if (specialRes[1] != true) {
      // Begin of update process of EventTeam Table (score)
      let pgRes2  = await MyPG.getOneMatch(idMatch);
      let res2 = pgRes2[1][0];
      var idTeamA = res2.idteama;
      var idTeamB = res2.idteamb;
      var idEvent = res2.idevent;
      let pgRes3A = await MyPG.getOneEventTeam(idEvent, idTeamA); // get previous score for increment
      let res3A   = pgRes3A[1][0];
      var winA    = res3A.win;
      var loseA   = res3A.lose;
      var penA    = res3A.penalites + penalitesA; // increment
      var ppA     = res3A.ptsPour + pointsA;
      var pcA     = res3A.ptsContre + pointsB;
      let pgRes3B = await MyPG.getOneEventTeam(idEvent, idTeamB);
      let res3B   = pgRes3B[1][0];
      var winB    = res3B.win;
      var loseB   = res3B.lose;
      var penB    = res3B.penalites + penalitesB;
      var ppB     = res3B.ptsPour + pointsB;
      var pcB     = res3B.ptsContre + pointsA;
      if (pointsA > pointsB) {
        winA++;
        loseB++;
      }
      if (pointsA < pointsB) {
        winB++;
        loseA++;
      }
      await MyPG.updateTeamScore(idEvent, idTeamA, winA, loseA, penA, ppA, pcA);
      await MyPG.updateTeamScore(idEvent, idTeamB, winB, loseB, penB, ppB, pcB);
    }
    // End of update process

    var code = 202; // Accepted
    if (pgRes != null) {
      code = 406;
    } // Not Acceptable
    res.status(code).json([{ res: code, err: pgRes }]); // status of the only one we can revert..
  }
);

app.post("/removeEventMatch/:idMatch", async (req, res) => {
  var idMatch     = req.params.idMatch;
  let pgRes       = await MyPG.removeEventMatch(idMatch);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/**
 * MATCHS:END
 */



/**
 * DISPONIBILITIES:BEGIN
 */
app.get("/getAllScheduled/:idEvent", async (req, res) => {
  var idEvent     = req.params.idEvent;
  let pgRes       = await MyPG.getAllScheduled(idEvent);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ allScheduled: pgRes }]);
});

app.get("/getAllAvailableForEvent/:idEvent", async (req, res) => {
  var idEvent     = req.params.idEvent;
  let pgRes       = await MyPG.getAllAvailableForEvent(idEvent);
  console.log(pgRes);
  var code        = 202; // Accepted
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ allAvailable: pgRes }]);
});

app.get('/getEventHourlyAvailability/:idEvent/:date', async (req,res) => {
  var idEvent     = req.params.idEvent;
  var date        = req.params.date;
  let pgRes       = await MyPG.getEventHourlyAvailability(idEvent, date);
  let T = {dispo: [], occupe: []};
  for(var i = 0; i < 24; i++){
    T.dispo.push([]);
    T.occupe.push([])
  }
  pgRes.forEach(obj => {
    for(var j = 0;j<24; j++){
      if(obj.grid[j]==1){
        T.dispo[j].push(obj.email);
      }
      if(obj.grid[j]==2){
        T.occupe[j].push(obj.email);
      }
    }
  });
  //console.log(T.occupe[12]);//Enter the Hour you want
  var code        = 202;
  if (pgRes == null) {
    code          = 406; // Not Acceptable
  }
  res.status(code).json([{ hourlyAvailability: T }]);
});

app.post("/addDispos/:idEvent/:email/:jon", async (req, res) => {
  var JHON        = req.params.jon;
  var idEvent     = req.params.idEvent;
  var email       = req.params.email;
  if (JHON == "hehe") {
    // hehe for debugging, anything else for using the DB at good ends
    JHON          = [
      {
        date: "2019-11-18",
        hDebut: "11:00:00",
        grid: [0,0,0,0,0,0, 0,0,0,0,0,1, 1,1,1,1,1,1, 1,1,0,0,0,0]
      },
      {
        date: "2019-11-19",
        hDebut: "08:00:00",
        grid: [0,0,0,0,0,0, 0,0,1,1,1,1, 1,1,1,1,1,1, 0,0,0,0,0,0]
      }
    ];
    JHON          = JSON.stringify(JHON);
  }
  var jon         = JSON.parse(JHON); // can't test on my own
  var code        = 202; // Accepted
  let pgRes;
  try {
    for (var i    = 0; i < jon.length; i++) {
      var date    = jon[i].date;
      var hDebut  = jon[i].hDebut;
      var grid    = jon[i].grid;
      pgRes       = await MyPG.addDispos(idEvent, email, date, hDebut, grid);
      if (pgRes != null) {
        code      = 406; // Not Acceptable
        throw pgRes; // stack Tracer
      }
    }
  } catch (e) {}
  res.status(code).json([{ res: code, err: pgRes }]);
});

app.post("/removeDispo/:idEvent/:email/:date", async (req, res) => {
  var idEvent     = req.params.idEvent;
  var email       = req.params.email;
  var date        = req.params.date;
  let pgRes       = await MyPG.removeDispo(idEvent, email, date);
  var code        = 202; // Accepted
  if (pgRes != null) {
    code          = 406; // Not Acceptable
  } 
  res.status(code).json([{ res: code, err: pgRes }]);
});
/**
 * DISPONIBILITIES:END
 */



/*
 ** CRITICALS:BEGIN
 */
app.get("/*", (req, res) => {
  res.status(501); // Under Development
});

// Basicly allows this api to wait for requests.
app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});
/*
 ** CRITICALS:END
 */

/**
 * END OF FILE
 */
