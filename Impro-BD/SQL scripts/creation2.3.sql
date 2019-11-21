CREATE DOMAIN USER_STATUS
  CHAR (1)
  CHECK (VALUE IN ('A', 'B', 'D','P')) -- (A)dmin (B)enevole (P)ublic (D)emande benevole
;


CREATE DOMAIN DEPOT_STATUS
  CHAR(3)
  CHECK (VALUE IN ('ATT', 'REC', 'REM')) -- (ATT)ente (REC)ue (REM)is
;


CREATE DOMAIN SCORE_STATUS
  CHAR(3)
  CHECK (VALUE IN ('YET', 'DEF', 'VIC', 'DRW')) -- (YET) to come (DEF)eat (VIC)tory (DRW)=draw
;


CREATE DOMAIN PASSWORD
	VARCHAR(255)
	CHECK (LENGTH(VALUE)>= 8)
;


CREATE TABLE Users (
  email 	VARCHAR(255) 	NOT NULL,
  nom 		VARCHAR(255) 	NOT NULL,
  prenom 	VARCHAR(255) 	NOT NULL,
  telephone VARCHAR(255) 	NOT NULL, -- N'est pas INT car ca ajoute une gestion de format decalissante
  status USER_STATUS NOT NULL DEFAULT 'D',
  CONSTRAINT Users_PK0 PRIMARY KEY (email),
  CONSTRAINT Users_U0 UNIQUE (telephone)
);


-- Lors de sa creation, le compte de benevole peut avoir acces a son profil.
-- Mais ce dernier doit etre aprouver pour acceder aux donnees d'un evenements, etc. TODO: -> != table DemandeBenevole.
CREATE TABLE Credentials (
  email VARCHAR(255) NOT NULL,
  psw PASSWORD NOT NULL,   -- TODO: specifier un psw solide
  status USER_STATUS NOT NULL DEFAULT 'D', -- Default a demande pour devenir benevole
  lastCon TIMESTAMP DEFAULT LOCALTIMESTAMP,
  ip VARCHAR(255) NOT NULL,
  CONSTRAINT Credentials_PK0 PRIMARY KEY (email, psw),
  CONSTRAINT Credentials_FK0 FOREIGN KEY (email) REFERENCES Users,
  CONSTRAINT Credentials_U0 UNIQUE (IP)
);


CREATE TABLE Teams (
  idTeam VARCHAR(255) 	NOT NULL,
  nom VARCHAR(255) 	NOT NULL,
  nbJoueurs DECIMAL(3,0) 	NOT NULL,
  coach VARCHAR(255) 	NOT NULL,
  telephone VARCHAR(255) 	NOT NULL,
  email VARCHAR(255) 	NOT NULL,
  CONSTRAINT Teams_PK0 PRIMARY KEY (idTeam)
);


CREATE TABLE Events (
  idEvent VARCHAR(255) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  lieu VARCHAR(255) NOT NULL,
  nbEquipes DECIMAL(3,0) NOT NULL,
  debut DATE NOT NULL,
  fin DATE NOT NULL,
  CONSTRAINT Events_PK0 PRIMARY KEY (idEvent)
);


CREATE TABLE EventTeams (
  idEvent VARCHAR(255) NOT NULL,
  idTeam VARCHAR(255) NOT NULL,
  estInscrit	BOOLEAN	DEFAULT FALSE,
  aPaye BOOLEAN DEFAULT FALSE,
  status_depot DEPOT_STATUS DEFAULT 'ATT',
  CONSTRAINT EventTeams_PK0 PRIMARY KEY (idEvent, idTeam),
  CONSTRAINT EventTeams_FK0 FOREIGN KEY (idEvent) REFERENCES Events,
  CONSTRAINT EventTeams_FK1 FOREIGN KEY (idTeam) REFERENCES Teams
);


CREATE TABLE Matchs (
  idMatch	VARCHAR(255) NOT NULL,
  idEvent	VARCHAR(255) NOT NULL,
  idTeamA	VARCHAR(255) NOT NULL,
  idTeamB VARCHAR(255) NOT NULL,
  terrain VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  beneA	VARCHAR(255) NOT NULL,
  beneB	VARCHAR(255) NOT NULL,
  beneC VARCHAR(255) NOT NULL,
  CONSTRAINT Matchs_PK0 PRIMARY KEY (idMatch),
  CONSTRAINT Matchs_FK0 FOREIGN KEY (beneA) REFERENCES Users,
  CONSTRAINT Matchs_FK1 FOREIGN KEY (beneB) REFERENCES Users,
  CONSTRAINT Matchs_FK2 FOREIGN KEY (beneC) REFERENCES Users,
  CONSTRAINT Matchs_FK3 FOREIGN KEY (idTeamA) REFERENCES Teams,
  CONSTRAINT Matchs_FK4 FOREIGN KEY (idTeamB) REFERENCES Teams,
  CONSTRAINT Matchs_FK5 FOREIGN KEY (idEvent) REFERENCES Events
);


CREATE TABLE MatchScore (
  idMatch VARCHAR(255) NOT NULL,
  idTeam VARCHAR(255)	NOT NULL,
  points DECIMAL(3,0) DEFAULT 0,
  penalites DECIMAL(3,0) 	DEFAULT 0,
  status SCORE_STATUS 	DEFAULT 'YET',
  CONSTRAINT MatchScore_PK0 PRIMARY KEY (idMatch, idTeam),
  CONSTRAINT MatchScore_FK0 FOREIGN KEY (idMatch) REFERENCES Matchs,
  CONSTRAINT MatchScore_FK1 FOREIGN KEY (idTeam) REFERENCES Teams
);
