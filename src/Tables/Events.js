/**
 * 
 * class Events:
 * 
 * getAllEvents()
 * getOneEvent()
 * addEvent()
 * updateEvent()
 * removeEvent()
 * 
 */
module.exports = 
class Events {

    constructor(pool){
        this.pool = pool;
    }

    // obtenir tous les events
    async getAllEvents() {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        await client
          .query('SELECT * FROM Events')
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // Obtenir un evenement
    async getOneEvent(id) {
        var code = 0, temp;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Events WHERE idEvent = $1';
        const queryValues = [id];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // Ajouter un Evenement
    async addEvent(id, nom, lieu, nbEquipes, debut, fin) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'INSERT INTO Events(idEvent, nom, lieu, nbEquipes, debut, fin) VALUES ($1, $2, $3, $4, $5, $6)';
              const queryValues = [id, nom, lieu, nbEquipes, debut, fin];
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

    // Metre a jour un evenement
    async updateEvent(id, nom, lieu, nbEquipes, debut, fin) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Events SET nom = $2, lieu = $3, nbEquipes = $4, debut = $5, fin = $6 WHERE idEvent = $1';
              const queryValues = [id, nom, lieu, nbEquipes, debut, fin];
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
    async removeEvent(id) {
        var er = null, code =0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'DELETE FROM Events * WHERE idEvent = $1';
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