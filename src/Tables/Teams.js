/**
 * 
 * class Teams:
 * 
 * getAllTeams()
 * getOneTeam()
 * addTeam()
 * updateTeam()
 * removeTeam()
 * 
 */
module.exports = 
class Teams {

    constructor(pool){
        this.pool = pool;
    }

    // obtenir tous les equipes
    async getAllTeams() {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        await client
          .query('SELECT * FROM Teams')
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // obtenir une equipe
    async getOneTeam(id) {
        var code = 0, temp;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Teams WHERE idTeam = $1';
        const queryValues = [id];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // Ajouter une equipe
    async addTeam(id, nom, ecole, nb, coach, telephone, email) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'INSERT INTO Teams(idTeam, nom, ecole, nbJoueurs, coach, telephone, email) VALUES ($1, $2, $3, $4, $5, $6, $7)';
              const queryValues = [id, nom, ecole, nb, coach, telephone, email];
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

    async updateTeam(id, nom, ecole, nb, coach, telephone, email) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Teams SET nom = $2, ecole = $3, nbJoueurs = $4, coach = $5, telephone = $6, email = $7 WHERE idTeam = $1';
              const queryValues = [id, nom, ecole, nb, coach, telephone, email];
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

    // retirer un evenement
    async removeTeam(id) {
        var er = null, code =0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'DELETE FROM Teams * WHERE idTeam = $1';
              const userValue = [id];
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