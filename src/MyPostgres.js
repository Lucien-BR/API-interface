const { Pool } = require('pg');

module.exports =
class MyPostgres {

  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
  }

  getAllUsers() {
      const Query = "SELECT * FROM Users";
      this.pool.query(Query, (err, res) => {
          console.log(err, res.rows);
          return (err, res);
      });
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