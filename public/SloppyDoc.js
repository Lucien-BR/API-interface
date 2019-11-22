let jon = {
    Methods: "/",
    Default_Methods: "/methods :: {...}",
    Info: "Voici notre API!",
    Routes: "/gateways/<parameters>",
    Tables: {
        Classes: "Signature :: Return Type",
        Utilisateur: {
            GET:{
                Obtenir_Tout: "/users :: [{ users: {...} }]",
                Obtenir_Un: "/getOneUser :: [{ user: {...} }]"
            },
            POST:{
                Ajouter: "/addUser/<email>/<nom>/<prenom>/<telephone>/<status>/<motDePasse> :: 'res err'",
                Metre_A_Jour_Info: "/updateUser/<email>/<nom>/<prenom>/<telephone>/<status> :: 'res err'", 
                Metre_A_Jour_Mot_De_Passe: "/updatePsw/<email>/<nouveauMotDePasse> :: 'res err'",
                Metre_A_Jour_Status: "/updateStatus/<email>/<status> :: 'res err'",
                Retirer: "/removeUser/<email> :: 'res err'"
            }
        },
        Authentification: {
            GET: {
                Automatique: "/autoLogin/<IPv6> :: [{ autoLoginStatus: 'timedOutConn / unknownConn / <email>' }]",
                Regulier: "/login/<email>/<motDePasse>/<IPv6> :: [{ loginStatus: 'wrondCred / unknownCred / loggedIn' }]"
            },
            POST: {

            }
        },
        Evenement: {
            GET: {
                Obtenir_Tout: "/events :: [{ events: {...} }]",
                Obtenir_Un: "/getOneEvent/<idEvent> :: [{ Event: {...} }]"
            },
            POST: {
                Ajouter: "/addEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut>/<fin> :: 'res err'",
                Metre_A_Jour: "/updateEvent/<idEvent>/<nom>/<lieu>/<nbEquipes>/<debut>/<fin> :: 'res err'",
                Retirer: "/remove/<idEvent> :: 'res err'"
            }
        },
        Equipes: {
            GET: {
                Obtenir_Tout: "/teams :: [{ teams: {...} }]",
                Obtenir_Un: "/getOneTeam/<idTeam> :: [{ team: {...} }]"
            },
            POST: {
                Ajouter: "/addTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: 'res err'",
                Metre_A_Jour: "/updateTeam/<idTeam>/<nomEquipe>/<nbJoueurs>/<coach>/<telephone>/<email> :: 'res err'",
                Retirer: "/removeTeam/<idTeam> :: 'res err'"
            }
        }
    }
};


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

function beautifyMyJson() {
    var str = JSON.stringify(this.jon, null, '\t'); // ca marche bien
    output(syntaxHighlight(str));
}

beautifyMyJson();