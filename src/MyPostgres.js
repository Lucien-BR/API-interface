const { Pool } = require("pg");
const Users = require("./Tables/Users.js");
const Creds = require("./Tables/Creds.js");
const Events = require("./Tables/Events.js");
const Teams = require("./Tables/Teams.js");
const EventTeams = require("./Tables/EventTeams.js");
const Matchs = require("./Tables/Matchs.js");
const Dispos = require("./Tables/Dispos.js");

module.exports = class MyPostgres {
  /*
   ** CRITICALS:BEGIN
   */
  constructor() {
    this.connectionString =
      "postgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
    this.users = new Users(this.pool);
    this.creds = new Creds(this.pool);
    this.events = new Events(this.pool);
    this.teams = new Teams(this.pool);
    this.eTeams = new EventTeams(this.pool);
    this.matchs = new Matchs(this.pool);
    this.dispos = new Dispos(this.pool);
  }
  /*
   ** CRITICALS:END
   */

  /*
   ** USERS:BEGIN
   */
  async getAllUsers() {
    return await this.users.getAllUsers();
  }

  async getAllBenevoles() {
    return await this.users.getAllBenevoles();
  }

  async getOneUser(email) {
    return await this.users.getOneUser(email);
  }

  async getBenevoleDemandes() {
    return await this.users.getBenevoleDemandes();
  }

  async addUser(email, nom, prenom, telephone, status) {
    return await this.users.addUser(email, nom, prenom, telephone, status);
  }

  async updateUser(email, nom, prenom, telephone) {
    return await this.users.updateUser(email, nom, prenom, telephone);
  }

  async updateUserStatus(email, status) {
    return await this.users.updateUserStatus(email, status);
  }

  async removeUser(email) {
    return await this.users.removeUser(email);
  }

  /*
   ** USERS:END
   */

  /*
   ** CREDENTIALS:BEGIN
   */
  async autoLogin(ip) {
    return await this.creds.autoLogin(ip);
  }

  async login(email, psw, ip) {
    return await this.creds.login(email, psw, ip);
  }

  // TODO: to be removed
  async login2(email, psw) {
    return await this.creds.login2(email, psw);
  }

  async addCred(email, psw, status, Q1, R1) {
    return await this.creds.addCred(email, psw, status, Q1, R1);
  }

  async updateCredPsw(email, psw) {
    return await this.creds.updateCredPsw(email, psw);
  }

  async updateCredStatus(email, status) {
    return await this.creds.updateCredStatus(email, status);
  }

  async removeCred(email) {
    return await this.creds.removeCred(email);
  }

  async gimmeQR(email) {
    return await this.creds.gimmeQR(email);
  }
  /*
   ** CREDENTIALS:END
   */

  /**
   * EVENTS:BEGIN
   */
  async getAllEvents() {
    return await this.events.getAllEvents();
  }

  async getOneEvent(id) {
    return await this.events.getOneEvent(id);
  }

  async addEvent(id, nom, lieu, nbEquipes, debut, fin) {
    return await this.events.addEvent(id, nom, lieu, nbEquipes, debut, fin);
  }

  async updateEvent(id, nom, lieu, nbEquipes, debut, fin) {
    return await this.events.updateEvent(id, nom, lieu, nbEquipes, debut, fin);
  }

  async removeEvent(id) {
    return await this.events.removeEvent(id);
  }
  /**
   * EVENTS:END
   */

  /**
   * TEAMS:BEGIN
   */
  async getAllTeams() {
    return await this.teams.getAllTeams();
  }

  async getOneTeam(id) {
    return await this.teams.getOneTeam(id);
  }

  async addTeam(id, nom, ecole, nb, coach, telephone, email) {
    return await this.teams.addTeam(
      id,
      nom,
      ecole,
      nb,
      coach,
      telephone,
      email
    );
  }

  async updateTeam(id, nom, ecole, nb, coach, telephone, email) {
    return await this.teams.updateTeam(
      id,
      nom,
      ecole,
      nb,
      coach,
      telephone,
      email
    );
  }

  async removeTeam(id) {
    return await this.teams.removeTeam(id);
  }
  /**
   * TEAMS:END
   */

  /**
   * EVENT-TEAMS:BEGIN
   */
  async getAllEventTeams(idEvent) {
    return await this.eTeams.getAllEventTeams(idEvent);
  }

  async getEventLeaderboard(idEvent) {
    return await this.eTeams.getEventLeaderboard(idEvent);
  }

  async getOneEventTeam(idEvent, idTeam) {
    return await this.eTeams.getOneEventTeam(idEvent, idTeam);
  }

  async addTeamToEvent(idEvent, idTeam) {
    return await this.eTeams.addTeamToEvent(idEvent, idTeam);
  }

  async updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, status_depot) {
    return await this.eTeams.updateTeamStatus(idEvent, idTeam, estInscrit, aPaye, status_depot);
  }

  async updateTeamScore(idEvent, idTeam, win, lose, penalites, ptsPour, ptsContre) {
    return await this.eTeams.updateTeamScore(idEvent, idTeam, win, lose, penalites, ptsPour, ptsContre);
  }

  async removeTeamFromEvent(idEvent, idTeam) {
    return await this.eTeams.removeTeamFromEvent(idEvent, idTeam);
  }
  /**
   * EVENT-TEAMS:END
   */

  /**
   * MATCHS:BEGIN
   */
  async getAllEventMatchs(idEvent) {
    return await this.matchs.getAllEventMatchs(idEvent);
  }

  async getOneMatch(idMatch) {
    return await this.matchs.getOneMatch(idMatch);
  }

  async getOneTeamEventMatchs(idEvent, idTeam) {
    return await this.matchs.getOneTeamEventMatchs(idEvent, idTeam);
  }

  async addMatchToEvent(idMatch, idEvent, idTeamA, idTeamB, terrain, date) {
    return await this.matchs.addMatchToEvent(idMatch,idEvent,idTeamA,idTeamB,terrain,date);
  }

  async updateEventMatchInfo(idMatch, terrain, date) {
    return await this.matchs.updateEventMatchInfo(idMatch, terrain, date);
  }

  // refered in ../index.js as /compileMatchScore/...
  async updateEventMatchScore(idMatch,pointsA,penalitesA,pointsB,penalitesB, overtime) {
    return await this.matchs.updateEventMatchScore(idMatch,pointsA,penalitesA,pointsB,penalitesB, overtime);
  }

  async removeEventMatch(idMatch) {
    return await this.matchs.removeEventMatch(idMatch);
  }

  async wasEventMatchUpdated(idMatch) {
    return await this.matchs.wasEventMatchUpdated(idMatch); // TODO: to be completed
  }
  /**
   * MATCHS:END
   */

  /**
   * DISPONIBILITIES:BEGIN
   */
  async getAllScheduled(idEvent) {
    return await this.dispos.getAllScheduled(idEvent);
  }

  async getAllAvailableForEvent(idEvent) {
    return await this.dispos.getAllAvailableForEvent(idEvent);
  }

  async getEventHourlyAvailability(idEvent, date) {
    return await this.dispos.getEventHourlyAvailability(idEvent, date);
  }

  async addDispos(idEvent, email, date, hDebut, grid) {
    return await this.dispos.addDispos(idEvent, email, date, hDebut, grid);
  }

  async removeDispo(idEvent, email, date) {
    return await this.dispos.removeDispo(idEvent, email, date);
  }
  /**
   * DISPONIBILITIES:END
   */
};
/*
 ** END OF FILE
 */
