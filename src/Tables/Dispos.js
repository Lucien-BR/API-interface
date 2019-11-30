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

module.exports = class Dispos {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllScheduled(idEvent) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM Disponibilities WHERE idEvent = $1";
    const queryValues = [idEvent];
    await client
      .query(queryText, queryValues)
      .then(res => {
        temp = res.rows;
      })
      .catch(err => {
        temp = err.stack;
        console.log(err.stack);
      });
    client.release();
    return temp;
  }

  async getEventHourlyAvailability(idEvent, date) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText =
      "SELECT * FROM disponibilities WHERE idEvent = $1 AND 1 = ANY (grid) AND date = $2;"; // CA MARCHE FINALY!
    const queryValues = [idEvent, date];
    await client
      .query(queryText, queryValues)
      .then(result => (temp = result.rows))
      .catch(e => {
        temp = err.stack;
        console.error(e.stack);
      });
    client.release();
    return temp;
  }

  async getAllAvailableForEvent(idEvent) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText =
      "SELECT * FROM disponibilities WHERE idEvent = $1 AND 1 = ANY (grid);"; // CA MARCHE FINALY!
    const queryValues = [idEvent];
    await client
      .query(queryText, queryValues)
      .then(result => (temp = result.rows))
      .catch(e => {
        temp = err.stack;
        console.error(e.stack);
      });
    client.release();
    return temp;
  }

  async addDispos(idEvent, email, date, hDebut, grid) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "INSERT INTO Disponibilities(idEvent, email, date, hDebut, grid) VALUES($1, $2, $3, $4, $5)";
        const queryValues = [idEvent, email, date, hDebut, grid];
        await client.query(queryText, queryValues, (err, res) => {
          if (err != null) {
            console.log(err);
            er = err.detail;
          }
        });
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
      return er;
    })().catch();
    return myErr;
  }

  async removeDispo(idEvent, email, date) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "DELETE FROM Disponibilities WHERE idEvent = $1 AND email = $2 AND date = $3";
        const queryValues = [idEvent, email, date];
        await client.query(queryText, queryValues, (err, res) => {
          if (err != null) {
            console.log(err);
            er = err.detail;
          }
        });
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
      return er;
    })().catch();
    return myErr;
  }
};
