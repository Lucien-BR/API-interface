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
module.exports = class Events {
  constructor(pool) {
    this.pool = pool;
  }

  // obtenir tous les events
  async getAllEvents() {
    var temp = null;
    const client = await this.pool.connect();
    await client
      .query("SELECT * FROM Events ORDER BY fin DESC")
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

  // Obtenir un evenement
  async getOneEvent(id) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM Events WHERE idEvent = $1";
    const queryValues = [id];
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

  // Ajouter un Evenement
  async addEvent(id, nom, lieu, nbEquipes, debut, fin) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "INSERT INTO Events(idEvent, nom, lieu, nbEquipes, debut, fin) VALUES ($1, $2, $3, $4, $5, $6)";
        const queryValues = [id, nom, lieu, nbEquipes, debut, fin];
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

  // Metre a jour un evenement
  async updateEvent(id, nom, lieu, nbEquipes, debut, fin) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "UPDATE Events SET nom = $2, lieu = $3, nbEquipes = $4, debut = $5, fin = $6 WHERE idEvent = $1";
        const queryValues = [id, nom, lieu, nbEquipes, debut, fin];
        await client.query(queryText, queryValues, (err, res) => {
          if (err != null) {
            console.log(err);
            er = err.detail;
          }
        });
        await client.query("COMMIT");
      } catch (e) {
        code = 1;
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
      return er;
    })().catch();
    return myErr;
  }

  // retirer un evenement
  async removeEvent(id) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText = "DELETE FROM Events * WHERE idEvent = $1";
        const userValue = [id];
        await client.query(queryText, queryValues, (err, res) => {
          if (err != null) {
            console.log(err);
            er = err.detail;
          }
        });
        await client.query("COMMIT");
      } catch (e) {
        code = 1;
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
