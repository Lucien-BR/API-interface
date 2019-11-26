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
module.exports = 
class Matchs {

    constructor(pool){
        this.pool = pool;
    }

    // obtenir tous les matchs pour un evenement
    async getAllEventMatchs(idEvent) {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Matchs WHERE idEvent = $1';
        const queryValues = [idEvent];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    //obtenir un match
    async getOneMatch(idMatch) {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Matchs WHERE idMatch = $1';
        const queryValues = [idMatch];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // obtenir les match pour une evenement d'une equipe
    async getOneTeamEventMatchs(idEvent, idTeam) {
        var code = 0, temp;
        const client = await this.pool.connect();
        const queryText = 'SELECT * FROM Matchs WHERE idEvent = $1 AND idTeam = $2';
        const queryValues = [idEvent, idTeam];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // Ajouter un match a un evenement
    async addMatchToEvent(idMatch, idEvent, idTeamA, idTeamB, terrain, date) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'INSERT INTO Matchs(idMatch, idEvent, idTeamA, idTeamB, terrain, date) VALUES ($1, $2, $3, $4, $5, $6)';
              const queryValues = [idMatch, idEvent, idTeamA, idTeamB, terrain, date];
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

    // Mettre a jour infos un match pour un event
    async updateEventMatchInfo(idMatch, terrain, date) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Matchs SET terrain = $2, date = $3 WHERE idMatch = $1';
              const queryValues = [idMatch, terrain, date];
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

    // Mettre a jour SCORE un match pour un event IMPORTANT
    async updateEventMatchScore(idMatch, pointsA, penalitesA, pointsB, penalitesB) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE Matchs SET pointsA = $2, penalitesA = $3, pointsB = $4, penalitesB = $5, wasUpdated = 1 WHERE idMatch = $1';
              const queryValues = [idMatch, pointsA, penalitesA, pointsB, penalitesB];
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

    // retirer un match
    async removeEventMatch(idMatch) {
        var er = null, code =0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'DELETE FROM Teams * WHERE idMatch = $1';
              const userValue = [idMatch];
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

    async wasEventMatchUpdated(idMatch) {
      var code = 0, temp;
      const client = await this.pool.connect();
      const queryText = 'SELECT wasUpdated FROM Matchs WHERE idMatch = $1';
      const queryValues = [idMatch];
      await client
        .query(queryText, queryValues)
        .then(result => temp = result.rows)
        .catch(e => {console.error(e.stack); code = 1;});
      client.release();
      return  [code, temp];
    }
}