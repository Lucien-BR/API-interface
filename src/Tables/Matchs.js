/**
 *
 * class Matchs:
 *
 * getAllEventMatchs()
 * getOneMatch()
 * getOneTeamEventMatchs()
 * addMatchToEvent()
 * updateEventMatchInfo()
 * updateEventMatchScore()
 * removeEventMatch()
 *
 */
module.exports = class Matchs {
  constructor(pool) {
    this.pool = pool;
  }

  // obtenir tous les matchs pour un evenement
  async getAllEventMatchs(idEvent) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM Matchs WHERE idEvent = $1";
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
  //obtenir un match
  async getOneMatch(idMatch) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM Matchs WHERE idMatch = $1";
    const queryValues = [idMatch];
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

  // obtenir les match pour une evenement d'une equipe
  async getOneTeamEventMatchs(idEvent, idTeam) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM Matchs WHERE idEvent = $1 AND (idTeamA = $2 OR idTeamB =$2)";
    const queryValues = [idEvent, idTeam];
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

  // Ajouter un match a un evenement
  async addMatchToEvent(idMatch, idEvent, idTeamA, idTeamB, terrain, date) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "INSERT INTO Matchs(idMatch, idEvent, idTeamA, idTeamB, terrain, date) VALUES ($1, $2, $3, $4, $5, $6)";
        const queryValues = [idMatch, idEvent, idTeamA, idTeamB, terrain, date];
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

  // Mettre a jour infos un match pour un event
  async updateEventMatchInfo(idMatch, terrain, date) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "UPDATE Matchs SET terrain = $2, date = $3 WHERE idMatch = $1";
        const queryValues = [idMatch, terrain, date];
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

  // Mettre a jour SCORE un match pour un event IMPORTANT
  async updateEventMatchScore(idMatch,pointsA,penalitesA,pointsB,penalitesB, overtime) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "UPDATE Matchs SET pointsA = $2, penalitesA = $3, pointsB = $4, penalitesB = $5, overtime = $6, wasUpdated = TRUE WHERE idMatch = $1";
        const queryValues = [idMatch, pointsA, penalitesA, pointsB, penalitesB, overtime];
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

  // retirer un match
  async removeEventMatch(idMatch) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText = "DELETE FROM Teams * WHERE idMatch = $1";
        const userValue = [idMatch];
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

  async wasEventMatchUpdated(idMatch) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT wasUpdated FROM Matchs WHERE idMatch = $1";
    const queryValues = [idMatch];
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
};
