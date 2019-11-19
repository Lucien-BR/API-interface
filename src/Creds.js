module.exports =
class Creds {
    // Voir tout Credentials 
    async getAllCreds() {
        var code = 0, temp;
        const client = await this.pool.connect();
        await client
          .query('SELECT * FROM Credentials')
          .then(result => temp = result)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return [code, temp];
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