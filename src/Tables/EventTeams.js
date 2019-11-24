/**
 * 
 * class EventTEam:
 * 
 * getAllEventTeams()
 * getEventLeaderboard()
 * addTeamToEvent()
 * updateTeamStatus()
 * updateTeamScore()
 * removeTeamFromEvent()
 * 
 */
module.exports = 
class Events {

    constructor(pool){
        this.pool = pool;
    }

    // obtenir toutes les equipes d'un evenement
    async getAllEventTeams(idEvent) {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        const queryText = "SELECT * FROM EventTeams WHERE idEvent = $1";
        const queryValues = [idEvent];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // obtenir leaderboard
    async getEventLeaderboard(idEvent) {
        var code = 0, temp = null;
        const client = await this.pool.connect();
        const queryText = "SELECT * FROM EventTeams WHERE idEvent = $1 ORDER BY win ASC";
        const queryValues = [idEvent];
        await client
          .query(queryText, queryValues)
          .then(result => temp = result.rows)
          .catch(e => {console.error(e.stack); code = 1;});
        client.release();
        return  [code, temp];
    }

    // Ajouter une Equipe a un Evenement
    async addTeamToEvent(idEvent, idTeam) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'INSERT INTO EventTeams(idEvent, idTeam) VALUES ($1, $2)';
              const queryValues = [idEvent, idTeam];
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

    // Metre a jour les status d'une equipe pour un evenement
    async updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, status_depot) {
        var er = null, code = 0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'UPDATE EventTeams SET estInscrit = $3, aPaye = $4, status_depot = $5 WHERE idEvent = $1 AND idTeam = $2';
              const queryValues = [idEvent, idTeam, estInscrit, aPaye, status_depot];
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

        // Metre a jour les statistiques d'une equipe pour un evenement
        async updateTeamScore(idEvent, idTeam, win, lose, penalites) {
            var er = null, code = 0;
            ;(async () => {
                const client = await this.pool.connect();
                try {
                  await client.query('BEGIN');
                  const queryText = 'UPDATE EventTeams SET win = $3, lose = $4, penalites = $5 WHERE idEvent = $1 AND idTeam = $2';
                  const queryValues = [idEvent, idTeam, win, lose, penalites];
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

    // retirer une equipe d'un evenement
    async removeTeamFromEvent(idEvent, idTeam) {
        var er = null, code =0;
        ;(async () => {
            const client = await this.pool.connect();
            try {
              await client.query('BEGIN');
              const queryText = 'DELETE FROM EventTeams * WHERE idEvent = $1 AND idTeam =$2';
              const userValue = [idEvent, idTeam];
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