/**
 * class Users :
 * 
 * getAllUsers()
 * getAllBenevoles()
 * getOneUsers()
 * addUser()
 * updateUser()
 * updateUserStatus()
 * removeUser()
 * 
 */

module.exports =
class Users {
    constructor(pool) {
        this.pool = pool;
    }

    // obtenir tout les utilisateurs
    async getAllUsers() {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        await client
          .query('SELECT * FROM Users')
          .then(result => temp = result) // prob. redondant
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // retourner tout les benevoles
    async getAllBenevoles() {
      var code = 0, temp = null;
      const client = await this.pool.connect();
      await client
        .query("SELECT * FROM Users WHERE status = 'B'")
        .then(result => temp = result) // prob. redondant
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
  }

    // retourner un utilisateur
    async getOneUser(email) {
      var code = 0, temp;
      const client = await this.pool.connect();
      const queryText = 'SELECT * FROM Users WHERE email = $1';
      const queryValues = [email];
      await client
        .query(queryText, queryValues)
        .then(result => temp = result) // prob. redondant
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
    }

    // retourner un benevole
    async getOneBenevole(email) {
      var code = 0, temp;
      const client = await this.pool.connect();
      const queryText = "SELECT * FROM Users WHERE email = $1 AND status = 'B'";
      const queryValues = [email];
      await client
        .query(queryText, queryValues)
        .then(result => temp = result) // prob. redondant
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
    }

    // ajouteur un utilisateur (mot de passe est gere deux niveaux plus haut)
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
        return [code, er];
    }
    
    // metre a jour les infos d'un utilisateur
    async updateUser(email, nom, prenom, telephone) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Users SET nom = $1, prenom = $2, telephone = $3 WHERE email = $4';
              const queryValues = [nom, prenom, telephone, email];
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

    // metre a jour le status d'un utilisateur
    async updateUserStatus(email, status) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Users SET status = $2 WHERE email = $1';
              const queryValues = [email, status];
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

    // retirer un utilisateur
    async removeUser(email) {
        var er = null, code =0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');s
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
        return [code, er];
      }

}
/**
 * END OF FILE
 */