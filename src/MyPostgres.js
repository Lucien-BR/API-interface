const { Pool } = require('pg');

module.exports =
class MyPostgres {

  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
  }

  async getAllUsers() {
      var code = 0, temp;
      const client = await this.pool.connect();
      await client
        .query('SELECT * FROM Users')
        .then(result => temp = result) // prob. redondant
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
  }

  async getAllCreds() {
    var code = 0, temp;
    const client = await this.pool.connect();
    await client
      .query('SELECT * FROM Credentials')
      .then(result => temp = result) // prob. redondant
      .catch(e => {console.error(e.stack); code = 1;});
    client.release();
    return  [code, temp];
  }

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

  async addUser(email, nom, prenom, telephone, status) {
      var er = null, code = 0;
      ;(async () => {
          const client = await this.pool.connect();
          try {
            await client.query('BEGIN');
            const queryText = 'INSERT INTO Users(email, nom, prenom, telephone, status) VALUES($1, $2, $3, $4, $5)';
            const queryValues = [email, nom, prenom, telephone, status];
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

  async addCred(email, psw, status) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'INSERT INTO Credentials(email, psw, status) VALUES($1, $2, $3)';
          const queryValues = [email, psw, status];
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

  async updateUser(email, nom, prenom, telephone, status) {
      var er = null, code = 0;
      ;(async () => {
          const client = await this.pool.connect();
          try {
            await client.query('BEGIN');
            const queryText = 'UPDATE Users SET nom = $1, prenom = $2, telephone = $3, status = $4 WHERE email = $5';
            const queryValues = [nom, prenom, telephone, status, email];
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

  // psw change
  async updateCredPsw(email, psw) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'UPDATE Credentials SET psw = $1 WHERE email = $2';
          const queryValues = [psw, email];
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

  // status change
  async updateCredStatus(email, status) {
    var er = null, code = 0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'UPDATE Credentials SET status = $1 WHERE email = $2';
          const queryValues = [status, email];
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
  
  // TODO: at the moment, the nomEvent is the PK_0, add a serialized idEvent, to allow nam modifications.
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

  async removeUser(email) {
    var er = null, code =0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'DELETE FROM Users * WHERE email = $1';
          const userValue = [email];
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

  async removeCred(email) {
    var er = null, code =0;
    ;(async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const queryText = 'DELETE FROM Credentials * WHERE email = $1';
          const userValue = [email];
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


  errMessage(er) {
    if (er == null){    
      return("Task completed succesfully.\n");
    } 
    else {
      console.log(er.stack);
      return("Task failed, rolling back. Modifications were reverted.\n\n Have fun with the stack tracer! \n\n"+er.stack);
    }
  }

}