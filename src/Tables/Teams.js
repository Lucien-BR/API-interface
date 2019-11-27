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
        var temp = null;
        const client = await this.pool.connect();
        await client
          .query('SELECT * FROM Teams')
          .then(res => {temp = res.rows;})
          .catch(err => {temp = err.stack; console.log(err.stack);});
        client.release();
        return temp;
      }

    // obtenir une equipe
    async getOneTeam(id) {
        var temp = null;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Teams WHERE idTeam = $1';
        const queryValues = [id];
        await client
          .query(queryText, queryValues)
          .then(res => {temp = res.rows;})
          .catch(err => {temp = err.stack; console.log(err.stack);});
        client.release();
        return temp;
      }

    // Ajouter une equipe
    async addTeam(id, nom, ecole, nb, coach, telephone, email) {
      var er = null;
      let myErr = await (async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'INSERT INTO Teams(idTeam, nom, ecole, nbJoueurs, coach, telephone, email) VALUES ($1, $2, $3, $4, $5, $6, $7)';
              const queryValues = [id, nom, ecole, nb, coach, telephone, email];
              await client.query(queryText, queryValues, (err,res) => {
                if (err != null){
                    console.log(err);
                    er = err.detail;
                }
            });
            await client.query('COMMIT');
        } catch (e) {
            code = 1;
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        return er;
      })().catch();
    return myErr;
    }

    async updateTeam(id, nom, ecole, nb, coach, telephone, email) {
      var er = null;
      let myErr = await (async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Teams SET nom = $2, ecole = $3, nbJoueurs = $4, coach = $5, telephone = $6, email = $7 WHERE idTeam = $1';
              const queryValues = [id, nom, ecole, nb, coach, telephone, email];
              await client.query(queryText, queryValues, (err,res) => {
                if (err != null){
                    console.log(err);
                    er = err.detail;
                }
            });
            await client.query('COMMIT');
        } catch (e) {
            code = 1;
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        return er;
      })().catch();
    return myErr;
    }

    // retirer un evenement
    async removeTeam(id) {
        var er = null;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'DELETE FROM Teams * WHERE idTeam = $1';
              const userValue = [id];
              await client.query(queryText, queryValues, (err,res) => {
                if (err != null){
                    console.log(err);
                    er = err.detail;
                }
            });
            await client.query('COMMIT');
        } catch (e) {
            code = 1;
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        return er;
      })().catch();
    return myErr;
    }
}