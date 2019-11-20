/**
 * class Creds :
 * 
 * autoLogin()
 * addCred()
 * updateCredPsw()
 * updateCredStatus()
 * removeCred()
 * 
 */

module.exports =
class Creds {

    constructor(pool) {
      this.pool = pool;
    }

    async autoLogin(ip) {
      var temp = null, code = 0, ret = null;
      const client = await this.pool.connect();
      const queryText = "SELECT CASE WHEN EXISTS("+
                        "SELECT * FROM Credentials WHERE ip = $1 AND "+ 
                        "LOCALTIMESTAMP - lastCon > INTERVAL '15 MINUTE'"+ //SWITCHER LE > LORSQUE LASTCON UPDATE REGULIEREMENT
                        ") THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END";
      const queryValues = [ip];
      await client.query(queryText, queryValues)
        .then(res => temp = res.rows[0].case )
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      if (temp == 1) {
        ret = { autoLogin: "authorized" }; // if authorized, the Controler should send a full auth. request
        // TO BE COMPLETED (AKA add an authentification method here)
      }
      else if (temp == 0) {
        ret = { autoLogin: "declined" };
      }
      return [code, ret];
    }

    async login(email, psw, ip) {
      var temp = null, code = 0, ret = null;
      const client = await this.pool.connect();
      const queryText = "SELECT CASE WHEN EXISTS("+
                        "SELECT * FROM Credentials WHERE email = $1, psw = $2 AND "+ 
                        "LOCALTIMESTAMP - lastCon > INTERVAL '15 MINUTE'"+ 
                        ") THEN (A1) ELSE (A2) END";
      const queryValues = [ip];
      await client.query(queryText, queryValues)
        .then(res => temp = res.rows[0].case )
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      if (temp == 1) {
        ret = { autoLogin: "authorized" };
      }
      else if (temp == 0) {
        ret = { autoLogin: "declined" };
      }
      return [code, ret];
    }


    // Ajouter Credential
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
      return [code, er];
    }

    // Metre a jour mot de passe
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
      return [code, er];
    }

    // changer le status
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
      return [code, er];
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
          return [code, er];
      }




}