/**
 *
 * class EventTEam:
 *
 * getAllEventTeams()
 * getEventLeaderboard()
 * getOneTeamInEvent()
 * addTeamToEvent()
 * updateTeamStatus()
 * updateTeamScore()
 * removeTeamFromEvent()
 *
 */
module.exports = class Events {
  constructor(pool) {
    this.pool = pool;
  }

  // obtenir toutes les equipes d'un evenement
  async getAllEventTeams(idEvent) {
    var code = 0,
      temp = null;
    const client = await this.pool.connect();
    const queryText = "SELECT * FROM EventTeams WHERE idEvent = $1";
    const queryValues = [idEvent];
    await client
      .query(queryText, queryValues)
      .then(result => (temp = result.rows))
      .catch(e => {
        console.error(e.stack);
        code = 1;
      });
    client.release();
    return [code, temp];
  }

  // obtenir leaderboard
  async getEventLeaderboard(idEvent) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText =
      "WITH A1 AS (" +
        "SELECT teams.idTeam, teams.nom AS teamName FROM teams"+
        "),"+
      "A2 AS ("+
        "SELECT * FROM eventteams WHERE idEvent = $1"+
      ")"+
      "SELECT * FROM A1 JOIN EventTeams ON A1.idTeam = eventteams.idTeam"+
        " ORDER BY win DESC";
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

  async getOneEventTeam(idEvent, idTeam) {
    var temp = null;
    const client = await this.pool.connect();
    const queryText =
      "SELECT * FROM EventTeams WHERE idEvent = $1 AND idTeam = $2";
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

  // Ajouter une Equipe a un Evenement
  async addTeamToEvent(idEvent, idTeam) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "INSERT INTO EventTeams(idEvent, idTeam) VALUES ($1, $2)";
        const queryValues = [idEvent, idTeam];
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

  // Metre a jour les status d'une equipe pour un evenement
  async updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, status_depot) {
    var er = null;
    if (estInscrit == "T") {
      estInscrit = true;
    } else {
      estInscrit = false;
    }
    if (aPaye == "T") {
      aPaye = true;
    } else {
      aPaye = false;
    }
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "UPDATE EventTeams SET estInscrit = $3, aPaye = $4, status_depot = $5 WHERE idEvent = $1 AND idTeam = $2";
        const queryValues = [idEvent, idTeam, estInscrit, aPaye, status_depot];
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

  // Metre a jour les statistiques d'une equipe pour un evenement
  async updateTeamScore(idEvent, idTeam, win, lose, penalites, ptsPour, ptsContre) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "UPDATE EventTeams SET win = $3, lose = $4, penalites = $5, ptsPour = $6, ptsContre = $7 WHERE idEvent = $1 AND idTeam = $2";
        const queryValues = [idEvent, idTeam, win, lose, penalites, ptsPour, ptsContre];
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

  // retirer une equipe d'un evenement
  async removeTeamFromEvent(idEvent, idTeam) {
    var er = null;
    let myErr = await (async () => {
      const client = await this.pool.connect();
      try {
        await client.query("BEGIN");
        const queryText =
          "DELETE FROM EventTeams * WHERE idEvent = $1 AND idTeam =$2";
        const userValue = [idEvent, idTeam];
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
