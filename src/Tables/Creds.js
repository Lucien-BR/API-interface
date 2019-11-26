/**
 * class Creds :
 * 
 * autoLogin()
 * login()
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

    // authentification automatique
    async autoLogin(ip) {
      var temp = null, code = 0;
      const client = await this.pool.connect();
      const queryText = // See this query in ./Impro-BD/SQL scripts/Query-Testing/autoLogin.sql
        "WITH "+ 
        "A1 AS ( "+ // return soit (unknownConn) ou (connTimedOut)
            "SELECT CASE WHEN EXISTS ( "+
                "SELECT * FROM Credentials "+
                "WHERE ip = $1 "+
            ") "+
                "THEN ('timedOutConn') "+
                "ELSE ('unknownConn') "+
                "END "+
        "), "+
        "A2 AS ( "+ // Return client's email -- DOIT REFRESH LE lasCon!!
            "UPDATE Credentials SET lastCon = LOCALTIMESTAMP "+
            "WHERE ip = $1 "+
            "RETURNING ( "+
                "SELECT email FROM Credentials "+
                "WHERE ip = $1 "+
            ") "+
        ") "+ // logged in
        "SELECT CASE WHEN EXISTS ( "+ // TRY LOGIN
            "SELECT * FROM Credentials "+
            "WHERE ip = $1 AND LOCALTIMESTAMP - lastCon < INTERVAL '15 MINUTE' "+
        ") "+
            "THEN ( "+
                "SELECT * FROM A2 "+
            ") "+
            "ELSE ( "+
                "SELECT * FROM A1 "+
            ") "+
            "END;";
      const queryValues = [ip];
      await client.query(queryText, queryValues)
        .then(res => temp = res.rows[0].case )
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      console.log(temp);
      return [code, temp];
    }

    // Authentification reguliere
    async login(email, psw, ip) {
      var temp = null, code = 0;
      const client = await this.pool.connect();
      const queryText = 
        "WITH "+ 
          "A1 AS ( "+
            "SELECT CASE WHEN EXISTS ( "+ // EMAIL EXIST? wrong psw or creat account -- ELSE RETURN sumthing
              "SELECT * FROM Credentials "+
              "WHERE email = $1 "+
            ") "+
              "THEN ('wrongCred') "+ // Pour ne pas dire mauvais mot de passe on dit mauvaise combinaison
              "ELSE ('unknownCred') "+ // n'extiste pas => creer nouveau user
              "END "+
          "), "+
          "A2 AS ( "+ // UPDATE IP AND LASTCON -- THEN -- RETURN loggedIn
            "UPDATE Credentials SET lastCon = LOCALTIMESTAMP, ip = $3 "+
            "WHERE email = $1 "+
            "RETURNING 'loggedIn' "+ // logged in
          ") "+
        "SELECT CASE WHEN EXISTS ( "+ // TRY LOGIN
          "SELECT * FROM Credentials "+
          "WHERE email = $1 AND psw = $2 "+
        ") "+
          "THEN ( "+
            "SELECT * FROM A2 "+
          ") "+
          "ELSE ( "+
            "SELECT * FROM A1 "+
          ") "+
          "END;";
      const queryValues = [email, psw, ip];
      await client.query(queryText, queryValues)
        .then(res => temp = res.rows[0].case )
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      //console.log(temp);
      return [code, temp];
    }

    // Authentification bs
    async login2(email, psw) {
      var temp = null, code = 0;
      const client = await this.pool.connect();
      const queryText = 
            "SELECT CASE WHEN EXISTS ( "+ 
              "SELECT * FROM Credentials "+
              "WHERE email = $1 AND psw = $2"+
            ") "+
              "THEN ('true') "+ 
              "ELSE ('false') "+
              "END ";
      const queryValues = [email, psw];
      await client.query(queryText, queryValues)
        .then(res => temp = res.rows[0].case )
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      //console.log(temp);
      return [code, temp];
    }

    


    // Ajouter Credential
    async addCred(email, psw, status, Q1, R1) {
      var er = null, code = 0;
      ;(async () => {
          const client = await this.pool.connect();
          try {
            await client.query('BEGIN');
            const queryText = 'INSERT INTO Credentials(email, psw, status, Q1, R1) VALUES($1, $2, $3, $4, $5)';
            const queryValues = [email, psw, status, Q1, R1];
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

    // retirer identifiants lors du retrait d'un utilisateur
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

    async gimmeQR(email) {
      var code = 0, temp;
      const client = await this.pool.connect();
      const queryText = 'SELECT (Q1,R1) FROM Credentials WHERE email = $1';
      const queryValues = [email];
      await client
        .query(queryText, queryValues)
        .then(result => temp = result) // prob. redondant
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
    }
}
/**
 * END OF FILE
 */