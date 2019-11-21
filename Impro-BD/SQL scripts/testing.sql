

INSERT INTO Users (email, nom, prenom, telephone, status)
VALUES ('luc@gmail.com', 'Regout', 'Lucien', '(111)-111-1111', 'A'),
       ('cam@hotmail.com', 'Chabot', 'Camille', '(123)-456-7890', 'B'),
       ('maxim@gmail.com', 'Pellerin', 'Maxime', '(111)-113-1111', 'B'),
       ('oli@hotmail.com', 'Savoie', 'Olivier', '(123)-455-7890', 'B')
;

INSERT INTO Credentials (email, psw, status,ip)
VALUES ('luc@gmail.com', 'beauPSW8', 'A','holaaaa'),
       ('cam@hotmail.com', 'Ceci_est_mon_mot_de_passe', 'B', 'holluuu')
;

INSERT INTO Events(idEvent, nom, lieu, nbEquipes, debut, fin)
VALUES ('unID','Coupe Longueuil 2021', 'Cégep Édouard-Montpetit', 18, '2019-03-06', '2019-03-08')
;

INSERT INTO Teams (idTeam, nom, nbJoueurs, coach, telephone, email)
VALUES ('unPetitID','Grand_V', 9, 'GM','(123)-456-7890','another@hotmail.com'),
			 ('deuxPetitsID','Rayon_X', 7, 'GP','(112)-121-1121','one@gmail.com')
;

INSERT INTO Matchs (idMatch, idEvent, idTeamA, idTeamB, terrain, date, beneA, beneB, beneC)
VALUES('unGrosID','unID','unPetitID','deuxPetitsID','Studio', '2019-03-07 11:00:00', 'cam@hotmail.com', 'maxim@gmail.com', 'oli@hotmail.com')
;

INSERT INTO MatchScore(idMatch, idTeam, points, penalites)
VALUES('unGrosID','unPetitID', 4, 0 )
;
