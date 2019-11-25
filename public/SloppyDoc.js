var jon = 
{
    "Methods": "/",
    "Default_Methods": "/methods :: {...}",
    "Info": "Voici notre API, version 1-24a",
    "Routes": "/gateways/<parameters>",
    "Tables": {
        "Classes": "Signature :: Return Type",
        "Utilisateur": {
            "GET":{
                "Obtenir_Tout": "/users :: [{ users: {...} }]",
                "Obtenir_Un": "/getOneUser/<email> :: [{ user: {...} }]"
            },
            "POST":{
                "Ajouter_Un": "/addUser/<email>/<nom>/<prenom>/<telephone>/<status>/<motDePasse> :: 'res err'",
                "Metre_A_Jour_Info": "/updateUser/<email>/<nom>/<prenom>/<telephone>/<status> :: 'res err'", 
                "Metre_A_Jour_Mot_De_Passe": "/updatePsw/<email>/<nouveauMotDePasse> :: 'res err'",
                "Metre_A_Jour_Status": "/updateStatus/<email>/<status> :: 'res err'",
                "Retirer_Un": "/removeUser/<email> :: 'res err'"
            }
        },
        "Benevoles": {
            "GET": {
                "Obtenir_Tout": "/users :: [{ benevoles: {...} }]",
                "Obtenir_Un": "/getOneBenevole/<email> :: [{ benevole: {...} }]"
            },
            "POST": {
                
            }
        },
        "Authentification": {
            "GET": {
                "Automatique": "/autoLogin/<IPv6> :: [{ autoLoginStatus: 'timedOutConn / unknownConn / <email>' }]",
                "Regulier": "/login/<email>/<motDePasse>/<IPv6> :: [{ loginStatus: 'wrondCred / unknownCred / loggedIn' }]",
                "Simple": "/login2/<email>/<motDePasse> :: [{ login: 'true / false' }]"
            },
            "POST": {

            }
        },
        "Evenement": {
            "GET": {
                "Obtenir_Tout": "/events :: [{ events: {...} }]",
                "Obtenir_Un": "/getOneEvent/<idEvent> :: [{ event: {...} }]"
            },
            "POST": {
                "Ajouter_Un": "/addEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut>/<fin> :: 'res err'",
                "Metre_A_Jour": "/updateEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut>/<fin> :: 'res err'",
                "Retirer_Un": "/remove/<idEvent> :: 'res err'"
            }
        },
        "Equipes": {
            "GET": {
                "Obtenir_Tout": "/teams :: [{ teams: {...} }]",
                "Obtenir_Un": "/getOneTeam/<idTeam> :: [{ team: {...} }]"
            },
            "POST": {
                "Ajouter_Un": "/addTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: 'res err'",
                "Metre_A_Jour": "/updateTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: 'res err'",
                "Retirer_Un": "/removeTeam/<idTeam> :: 'res err'"
            }
        },
        "Equipes_Dans_Evenement": {
            "GET": {
                "Obtenir_Classification": "/getEventLeaderboard/<idEvent> :: [{ leaderboard: {...} }]",
                "Obtenir_Tout": "/getAllEventTeams/<idEvent> :: [{ event_teams: {...} }]",
                "Obtenir_Un": "! Aucune implementation publique !"
            },
            "POST": {
                "Ajouter_Un": "/addTeamToEvent/<idEvent>/<idTeam> :: 'res err'",
                "Mettre_A_Jour_Status": "/updateTeamStatus/<idEvent>/<idTeam>/<estInscrit>/<aPaye>/<statusDepot> :: 'res err'",
                "Retirer_Un": "/removeTeamFromEvent/<idEvent>/<idTeam> :: 'res err'"
            },
            "DEPRECATED": {
                "Mettre_A_Jour_Statistique": "/updateTeamScore/<idEvent>/<idTeam>/<win>/<lose>/<penalites> :: 'res err'"
            }
        },
        "Matchs": {
            "GET": {
                "Obtenir_Tout_Dans_Evenement": "/getAllEventMatchs/<idEvent> :: [{ eventMatchs: {...} }]",
                "Obtenir_Tout_Sur_Une_Equipe_Pour_Evenement": "/getOneTeamEventMatchs/<idEvent>/<idMatch> :: [{ teamMatchs: {...} }]",
                "Obtenir_Un": "/getOneMatch/<idMatch> :: [{ match: {...} }]"
            },
            "POST": {
                "Ajouter_Un": "/addMatchToEvent/<idMatch>/<idEvent>/<idTeamA>/<idTeamB>/<terrain>/<date> :: 'res err'",
                "Mettre_A_Jour_Info": "/updateEventMatchInfo/<idMatch>/<terrain>/<date> :: 'res err'",
                "Envoyer_Resultat_Match": "/compileMatchScore/<idMatch>/<pointsA>/<penalitesA>/<pointsB>/<penalitesB> :: 'res err'",
                "Retirer_Un": "/removeEventMatch/<idMatch> :: 'res err'"
            }
        }
    }
}
;

function output(inp) {
    document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function beautifyMyJson(j) {
    var str = JSON.stringify(j, null, '\t'); // ca marche bien
    output(syntaxHighlight(str));
}

beautifyMyJson(jon);