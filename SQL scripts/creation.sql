CREATE DOMAIN STATUS
  CHAR (1)
  CHECK (VALUE IN ('A', 'B', 'D','P')) -- (A)dmin (B)enevole (P)ublic (D)emande benevole
;


CREATE DOMAIN DEPOT_STATUS
  CHAR(3)
  CHECK (VALUE IN ('ATT', 'REC', 'REM')) -- (ATT)ente (REC)ue (REM)is
;


CREATE TABLE Users (
  email VARCHAR(255) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL, -- N'est pas INT car ca ajoute une gestion de format decalissante
  status STATUS NOT NULL DEFAULT 'B',

  CONSTRAINT Users_PK0 PRIMARY KEY (email)
);


-- Lors de sa creation, le compte de benevole peut avoir acces a son profil.
-- Mais ce dernier doit etre aprouver pour acceder aux donnees d'un evenements, etc. TODO: -> != table DemandeBenevole.
CREATE TABLE Credentials (
  email VARCHAR(255) NOT NULL, 
  psw VARCHAR(255) NOT NULL,   -- TODO: specifier un psw solide
  status STATUS NOT NULL DEFAULT 'D', -- Default a demande pour devenir benevole

  CONSTRAINT Credentials_PK0 PRIMARY KEY (email, psw),
  CONSTRAINT Credentials_FK0 FOREIGN KEY (email) REFERENCES Users
);


CREATE TABLE Events(
	nomEvenement VARCHAR(255) NOT NULL,
	nomEcole VARCHAR(255) NOT NULL,
	nbEquipes DECIMAL(4,0)	 NOT NULL,

	dateDebut DATE NOT NULL,
	dateFin DATE NOT NULL,

	CONSTRAINT Constraint1 CHECK (dateFin > dateDebut),
  CONSTRAINT Events_PK0 PRIMARY KEY (nomEvenement)
);


CREATE TABLE Teams(
	nomEquipe	VARCHAR(255) NOT NULL,
	nomEcole VARCHAR(255) NOT NULL,
  	nbJoueurs DECIMAL(4,0) NOT NULL,

	estInscrit BOOLEAN DEFAULT FALSE,
	aPaye	BOOLEAN	DEFAULT FALSE,
	etatDepot DEPOT_STATUS DEFAULT 'ATT',

	CONSTRAINT User_PK0 PRIMARY KEY (nomEquipe)
);


CREATE TABLE Matchs(
  idMatch SMALLSERIAL,
	date TIMESTAMP NOT NULL,
	lieu VARCHAR(255) NOT NULL,
	
	equipe1	VARCHAR(255) NOT NULL,
	scoreEquipe1 DECIMAL(4,0) DEFAULT 0,
	penalitesEquipe1 DECIMAL(4,0) DEFAULT 0,
	
	equipe2	VARCHAR(255) NOT NULL,
	scoreEquipe2 DECIMAL(4,0) DEFAULT 0,
	penalitesEquipe2 DECIMAL(4,0) DEFAULT 0,

  CONSTRAINT Matchs_PK0 PRIMARY KEY (idMatch),
	CONSTRAINT Matchs_FK0 FOREIGN KEY (equipe1) REFERENCES Teams,
	CONSTRAINT Matchs_FK1 FOREIGN KEY (equipe2) REFERENCES Teams
);
