/**
 * Disponibilites:
 * 
 * getAllScheduled()
 * getAllAvailableForEvent()
 * 
 * addDispos() -- multiples a la fois
 * updateDispo()
 * removeDispo()
 */

module.exports =
class Dispos {

    constructor(pool){
        this.pool = pool;
    }

    async getAllScheduled(idEvent) {
        var code = 0, temp;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Disponibilities WHERE idEvent = $1';
        const queryValues = [idEvent];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    async getAllAvailableForEvent(idEvent) {
        var code = 0, temp;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM disponibilities WHERE idEvent = $1 AND 1 = ANY (grid);'; // CA MARCHE FINALY!
        const queryValues = [idEvent];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    async addDispos(idEvent, email, date, hDebut, nbHeures, grid) {
            var er = null, code = 0;
            ;(async () => {
                const client = await this.pool.connect();
                try {
                    await client.query('BEGIN');
                    const queryText = 'INSERT INTO Disponibilities(idEvent, email, date, hDebut, nbHeures, grid) VALUES($1, $2, $3, $4, $5, $6)';
                    const queryValues = [idEvent, email, date, hDebut, nbHeures, grid];
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

    async removeDispo(idEvent, email, date) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
                await client.query('BEGIN');
                const queryText = 'DELETE FROM Disponibilities WHERE idEvent = $1 AND email = $2 AND date = $3';
                const queryValues = [idEvent, email, date];
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
}