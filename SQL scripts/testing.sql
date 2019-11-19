INSERT INTO Users (email, nom, prenom, telephone, status)
VALUES ('luc@gmail.com', 'Regout', 'Lucien', '(111)-111-1111', 'A'),
       ('cam@hotmail.com', 'Chabot', 'Camille', '(123)-456-7890', 'B')
;

INSERT INTO Credentials (email, psw, status)
VALUES ('luc@gmail.com', 'beauPSW', 'A'),
       ('cam@hotmail.com', 'Ceci_est_mon_mot_de_passe', 'B')
;

INSERT INTO Events (nomEvenement, nomEcole, nbEquipes, dateDebut, dateFin)
VALUES ('Coupe Longueuil 2021', 'Cégep Édouard-Montpetit', 18, '2019-03-06', '2019-03-08')
;

INSERT INTO Teams (nomEquipe, nomEcole, nbJoueurs)
VALUES ('Grand_V', 'Cégep Édouard-Montpetit', 9),
		('Rayon_X', 'Cégep Édouard-Montpetit', 7)
;

INSERT INTO Matchs (date, lieu, equipe1, scoreEquipe1, penalitesEquipe1, equipe2, scoreEquipe2, penalitesEquipe2)
VALUES('2019-03-07 11:00:00', 'Studio', 'Grand_V', '2', '0', 'Rayon_X', '6', '3')
;


INSERT INTO Matchs (date, lieu, equipe1, equipe2)
VALUES('2019-03-08 12:00:00', 'C-30', 'Rayon_X', 'Grand_V')
;