const { Pool, Client } = require('pg');

module.exports =
class MyPostgres {

  test = null;
  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
    this.client = new Client({ connectionString: this.connectionString });
  }

  async getAllUsers() {
      this.client.connect();
      var temp;
      await this.client
        .query("SELECT * FROM Users")
        .then(result => temp = result)
        .catch(e => console.error(e.stack))
        .then(() => this.client.end());
      //resolve(result.rows);
      return  temp;
  }

  removeUser(email) {
      var state = 0;
      ;(async () => {
          const client = await this.pool.connect();
          try {
            await client.query('BEGIN');
            const queryText = 'DELETE FROM Users * WHERE email = $1';
            const userValue = [email];
            await client.query(queryText, userValue);
            await client.query('COMMIT');
          } catch (e) {
            state = 1;
            await client.query('ROLLBACK');
            throw e;
          } finally {
            client.release();
          }
        })().catch(e => console.error(e.stack));
      return state;
  }

  addUser(email, nom, prenom, telephone, status) {
      var state = 0;
      ;(async () => {
          const client = await this.pool.connect();
          try {
            await client.query('BEGIN');
            const queryText = 'INSERT INTO Users(email, nom, prenom, telephone, status) VALUES($1, $2, $3, $4, $5)';
            const userValues = [email, nom, prenom, telephone, status];
            await client.query(queryText, userValues);
            await client.query('COMMIT');
          } catch (e) {
            state = 1;
            await client.query('ROLLBACK');
            throw e;
          } finally {
            client.release();
          }
        })().catch(e => console.error(e.stack));
      return state;
  }

  errMessage(state) {
      if (state == 0){    
          return("\nTask completed succesfully.\n");
      } else {
          return("\nTask failed, rolling back. Modifications were reverted.\n");
      }
  }
}