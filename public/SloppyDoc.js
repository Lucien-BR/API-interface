var jon = 
{
    "Methods": "/",
    "Default_Methods": "/methods :: {...}",
    "Info": "Voici notre API, version 2-28b, Deployment Patch",
    "Routes": "/gateways/<parameters>",
    "err_res": "res=code http. err == null OU err == 0. Si il y a une erreur (donc res = 400ish) err == stack tracer.",
    "Tables": {
        "Classes": "Signature :: Return Type",
        "Utilisateur": {
            "GET":{
                "Obtenir_Tout": "/users :: [{ users: {...} }]",
                "Obtenir_Un": "/getOneUser/<email> :: [{ user: {...} }]"
            },
            "POST":{
                "Ajouter_Un": "/addUser/<email>/<nom>/<prenom>/<telephone>/<status value in ['A'dmin, 'B'enevole, 'P'ublic, 'D'emande]>/<motDePasse>/<Question1>/<Reponse1> :: [{ res: ___ , err: ___ }]",
                "Metre_A_Jour_Info": "/updateUser/<email>/<nom>/<prenom>/<telephone> :: [{ res: ___ , err: ___ }]", 
                "Metre_A_Jour_Mot_De_Passe": "/updatePsw/<email>/<nouveauMotDePasse> :: [{ res: ___ , err: ___ }]",
                "Metre_A_Jour_Status": "/updateStatus/<email>/<status> :: [{ res: ___ , err: ___ }]",
                "Retirer_Un": "/removeUser/<email> :: [{ res: ___ , err: ___ }]"
            }
        },
        "Benevoles": {
            "GET": {
                "Obtenir_Tout": "/benevoles :: [{ benevoles: {...} }]",
                "Obtenir_Tout_Demande": "/getBenevoleDemandes :: [{ demandes: {...} }]"
            },
            "POST": {
                
            }
        },
        "Authentification": {
            "GET": {
                "Automatique": "/autoLogin/<IPv6> :: [{ autoLoginStatus: 'timedOutConn / unknownConn / <email>' }]",
                "Regulier": "/login/<email>/<motDePasse>/<IPv6> :: [{ loginStatus: 'wrondCred / unknownCred / loggedIn' }]",
                "Simple": "/login2/<email>/<motDePasse> :: [{ login: 'true / false' }]",
                "Obtenir_Qustion_Reponse": "/gimmeQR/<email> :: [{ q1: 'Q1', r1:'R1' }]"
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
                "Ajouter_Un": "/addEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut dates format YYYY-MM-DD>/<fin> :: [{ res: ___ , err: ___ }]",
                "Metre_A_Jour": "/updateEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut dates format YYYY-MM-DD>/<fin> :: [{ res: ___ , err: ___ }]",
                "Retirer_Un": "/remove/<idEvent> :: [{ res: ___ , err: ___ }]"
            }
        },
        "Equipes": {
            "GET": {
                "Obtenir_Tout": "/teams :: [{ teams: {...} }]",
                "Obtenir_Un": "/getOneTeam/<idTeam> :: [{ team: {...} }]"
            },
            "POST": {
                "Ajouter_Un": "/addTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: [{ res: ___ , err: ___ }]",
                "Metre_A_Jour": "/updateTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: [{ res: ___ , err: ___ }]",
                "Retirer_Un": "/removeTeam/<idTeam> :: [{ res: ___ , err: ___ }]"
            }
        },
        "Equipes_Dans_Evenement": {
            "GET": {
                "Obtenir_Classification": "/getEventLeaderboard/<idEvent> :: [{ leaderboard: {...} }]",
                "Obtenir_Tout": "/getAllEventTeams/<idEvent> :: [{ event_teams: {...} }]",
                "Obtenir_Un": "! Aucune implementation publique !"
            },
            "POST": {
                "Ajouter_Un": "/addTeamToEvent/<idEvent>/<idTeam> :: [{ res: ___ , err: ___ }]",
                "Mettre_A_Jour_Status": "/updateTeamStatus/<idEvent>/<idTeam>/<estInscrit>/<aPaye>/<statusDepot value in ['ATT'ente, 'REC'ue, 'REM'is]> :: [{ res: ___ , err: ___ }]",
                "Retirer_Un": "/removeTeamFromEvent/<idEvent>/<idTeam> :: [{ res: ___ , err: ___ }]"
            },
            "DEPRECATED": {
                "Mettre_A_Jour_Statistique": "/updateTeamScore/<idEvent>/<idTeam>/<win>/<lose>/<penalites> :: [{ res: ___ , err: ___ }]"
            }
        },
        "Matchs": {
            "GET": {
                "Obtenir_Tout_Dans_Evenement": "/getAllEventMatchs/<idEvent> :: [{ eventMatchs: {...} }]",
                "Obtenir_Tout_Sur_Une_Equipe_Pour_Evenement": "/getOneTeamEventMatchs/<idEvent>/<idTeam> :: [{ teamMatchs: {...} }]",
                "Obtenir_Un": "/getOneMatch/<idMatch> :: [{ match: {...} }]"
            },
            "POST": {
                "Ajouter_Un": "/addMatchToEvent/<idMatch>/<idEvent>/<idTeamA>/<idTeamB>/<terrain>/<date> :: [{ res: ___ , err: ___ }]",
                "Mettre_A_Jour_Info": "/updateEventMatchInfo/<idMatch>/<terrain>/<date> :: [{ res: ___ , err: ___ }]",
                "Envoyer_Resultat_Match": "/compileMatchScore/<idMatch>/<pointsA>/<penalitesA>/<pointsB>/<penalitesB>/<overtime> :: [{ res: ___ , err: ___ }]",
                "Retirer_Un": "/removeEventMatch/<idMatch> :: [{ res: ___ , err: ___ }]"
            }
        },
        "Disponibilities": {
            "GET": {
                "Obtenir_Benevoles_A_L'Horaire": "/getAllScheduled/<idEvent> :: RETOURNE TOUTE LA TABLE POUR L'INSTANT, A DEFINIR...",
                "Obtenir_Benevoles_Disponible_Pour_Event": "/getAllAvailableForEvent/<idEvent> :: [{ allAvailable: {...} }]",
                "Obtenir_Dispos_&_Occupe_Event_Par_Heures": "/getEventHourlyAvailability/<idEvent>/<date> :: retour de format JSON",
                "JSON": {
                    "hourlyAvailability": {
                        "dispo":["array de 24 periode de 1h. chaque periode contient une liste de email de benevoles disponible"],
                        "occupe":["meme chose que le precedent (dispo) mais pour les non dispos car ils ont ete place a une tache"]
                    }
                }
            },
            "POST": {
                "Ajouter_Plusieurs_Dispos": {
                    "Methode": "/addDispos/<idEvent>/<email>/<JSON> :: [{ res: ___ , err: ___ }]",
                    "Explications": "Cette methode requiere que JSON ait cette exacte structure et ses clefs (prochain point)",
                    "JSON":[
                        {
                            "date": "<date1 (DATE) pour la premiere plage horaire (il peut y en avoir autant que souhaite>",
                            "hDebut": "<heure Debut Periode Disponibilite (TIME)>",
                            "grid": "[0,0,0,0,0,0,  0,0,0,0,0,0,  0,0,0,0,0,0,  0,0,0,0,0,0]"
                        },
                        {
                            "date": "<Date sous format AAAA-MM-JJ>",
                            "hDebut": "<Heure sous formay HH:MM:SS>",
                            "grid": "<comme la grille precedente mais la premiere est minuit, [1] 01h ... [23] 11h pm, 1 = dispo, 0 non dispo>"
                        },
                        {"etc":"..."}
                    ]
                },
                "Retirer_Un": "/removeDispo/<idEvent>/<email>/<date> :: [{ res: ___ , err: ___ }]"
            }
        }
    }
}
;
function output(inp) {
  document.body.appendChild(document.createElement("pre")).innerHTML = inp;
}

function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function beautifyMyJson(j) {
  var str = JSON.stringify(j, null, "\t");
  output(syntaxHighlight(str));
}

beautifyMyJson(jon);
