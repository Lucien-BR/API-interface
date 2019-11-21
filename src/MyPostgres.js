const { Pool } = require('pg');
const Users   = require('./Users.js');
const Creds   = require('./Creds.js');
const Events  = require('./Events.js');
const Teams   = require('./Teams.js')

module.exports =
class MyPostgres {
  /*
  ** CRITICALS:BEGIN
  */
  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool     = new Pool({ connectionString: this.connectionString });
    this.users    = new Users(this.pool);
    this.creds    = new Creds(this.pool);
    this.events   = new Events(this.pool); 
    this.teams    = new Teams(this.pool);
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

  async getOneUser(email) {
    return await this.users.getOneUser(email);
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

  async addCred(email, psw, status) {
    return await this.creds.addCred(email, psw, status);
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
     return await this.teams.addTeam(id, nom, ecole, nb, coach, telephone, email);
   }

   async updateTeam(id, nom, ecole, nb, coach, telephone, email) {
     return await this.teams.updateTeam(id, nom, ecole, nb, coach, telephone, email);
   }

   async removeTeam(id) {
     return await this.teams.removeTeam(id);
   }
   /**
    * TEAMS:END
    */
}
/*
** END OF FILE
*/