const { Pool } = require('pg');
const Users = require('./Users.js');
const Creds = require('./Creds.js');

module.exports =
class MyPostgres {
  /*
  ** CRITICALS:BEGIN
  */
  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
    this.users = new Users(this.pool);
    this.creds = new Creds(this.pool);
  }

  errMessage(er) {
    if (er == null){    
      return("Task completed succesfully.\n");
    } 
    else {
      console.log(er.stack);
      return("Task failed, rolling back. Modifications were reverted.\n\n Have fun with the stack tracer! \n\n"+er.stack);
    }
  }
  /*
  ** CRITICALS:END
  */



  /*
  ** USERS:BEGIN
  */
  async getAllUsers() {
    return await this.users.getAllUsers();
  }

  async addUser(email, nom, prenom, telephone, status) {
    let pgRes = await this.users.addUser(email, nom, prenom, telephone, status);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async updateUser(email, nom, prenom, telephone) {
    let pgRes = await this.users.updateUser(email, nom, prenom, telephone);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async updateUserStatus(email, status) {
    let pgRes = await this.users.updateUserStatus(email, status);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async removeUser(email) {
    let pgRes = await this.users.removeUser(email);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }
  /*
  ** USERS:END
  */


  /*
  ** CREDENTIALS:BEGIN
  */
  async getAllCreds() {
    return await this.creds.getAllCreds();
  }

  async addCred(email, psw, status) {
    let pgRes = await this.creds.addCred(email, psw, status);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async updateCredPsw(email, psw) {
    let pgRes = await this.creds.updateCredPsw(email, psw);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async updateCredStatus(email, status) {
    let pgRes = await this.creds.updateCredStatus(email, status);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }

  async removeCred(email) {
    let pgRes = await this.creds.removeCred(email);
    return [pgRes[0], this.errMessage(pgRes[1])];
  }
  /*
  ** CREDENTIALS:BEGIN
  */



  /*
  ==============================================================================================
  ==============================================================================================
  */



  /*
  ** DEPRECATED:BEGIN
  */
  async getAllEvents() {
    var code = 0, temp;
    const client = await this.pool.connect();
    await client
      .query('SELECT * FROM Events')
      .then(result => temp = result) // prob. redondant
      .catch(e => {console.error(e.stack); code = 1;});
    client.release();
    return  [code, temp];
  }

  async getAllTeams() {
    var code = 0, temp;
    const client = await this.pool.connect();
    await client
      .query('SELECT * FROM Teams')
      .then(result => temp = result) // prob. redondant
      .catch(e => {console.error(e.stack); code = 1;});
    client.release();
    return  [code, temp];
  }

  async getAllMatchs() {
    var code = 0, temp;
    const client = await this.pool.connect();
    await client
      .query('SELECT * FROM Matchs')
      .then(result => temp = result) // prob. redondant
      .catch(e => {console.error(e.stack); code = 1;});
    client.release();
    return  [code, temp];
  }

  async addEvent(nomEvent, nomEcole, nbEquipes, dateDebut, dateFin) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = "INSERT INTO Events(nomEvenement, nomEcole, nbEquipes, dateDebut, dateFin) VALUES($1, $2, $3, $4, $5)";
          const queryValues = [nomEvent, nomEcole, nbEquipes, dateDebut, dateFin];
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          code = 1;
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async addTeam(nomEquipe, nomEcole, nbJoueurs) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = "INSERT INTO Teams(nomEquipe, nomEcole, nbJoueurs) VALUES($1, $2, $3)";
          const queryValues = [nomEquipe, nomEcole, nbJoueurs];
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          code = 1;
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async addMatchFull(date, lieu, equipe1, scoreEquipe1, penalitesEquipe1, equipe2, scoreEquipe2, penalitesEquipe2) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          // '2019-03-08 13:00:00'
          const queryText = "INSERT INTO Matchs(date, lieu, equipe1, scoreEquipe1, penalitesEquipe1, equipe2, scoreEquipe2, penalitesEquipe2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
          const queryValues = [date, lieu, equipe1, scoreEquipe1, penalitesEquipe1, equipe2, scoreEquipe2, penalitesEquipe2];
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          code = 1;
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async addMatchPart(date, lieu, equipe1, equipe2) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          // '2019-03-08 13:00:00'
          const queryText = "INSERT INTO Matchs(date, lieu, equipe1, equipe2) VALUES ($1, $2, $3, $4)";
          const queryValues = [date, lieu, equipe1, equipe2];
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          code = 1;
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async updateEvent(nomEvent, nomEcole, nbEquipes, dateDebut, dateFin) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'UPDATE Events SET nomEcole = $2, nbEquipes = $3, dateDebut = $4, dateFin = $5 WHERE nomEvenement = $1';
          const queryValues = [nomEvent, nomEcole, nbEquipes, dateDebut, dateFin];
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          code = 1;
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async updateTeam(nomEquipe, nomEcole, nbJoueurs, estInscrit, aPaye, etatDepot) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'UPDATE Teams SET nomEcole = $2, nbJoueurs = $3, estInscrit = $4, aPaye = $5, etatDepot = $6 WHERE nomEquipe = $1';
          const queryValues = [nomEquipe, nomEcole, nbJoueurs, estInscrit, aPaye, etatDepot];
          //console.log(queryValues);
          await client.query(queryText, queryValues);
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          code = 1;
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async removeEvent(nomEvent) {
    var er = null, code =0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'DELETE FROM Events * WHERE nomEvenement = $1';
          const userValue = [nomEvent];
          await client.query(queryText, userValue);
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          code = 1;
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }

  async removeTeam(nomEquipe) {
    var er = null, code =0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'DELETE FROM Teams * WHERE nomEquipe = $1';
          const userValue = [nomEquipe];
          await client.query(queryText, userValue);
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          code = 1;
          throw e;
        } finally {
          client.release();
        }
      })().catch(e => {console.error(e.stack); er = e});
    return [code, this.errMessage(er)];
  }
  /*
  ** DEPRECATED:END 
  */

}
/*
** END OF FILE
*/