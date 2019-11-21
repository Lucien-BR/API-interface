const { Pool } = require('pg');
const Users = require('./Users.js');
const Creds = require('./Creds.js');

module.exports =
class MyPostgres {
  /*
  ** CRITICALS:BEGIN
  */
  constructor() {
    this.connectionString = "psotgresql://Lucien:lu-db@35.245.152.215:5432/impro-bd";
    this.pool = new Pool({ connectionString: this.connectionString });
    this.users = new Users(this.pool);
    this.creds = new Creds(this.pool);
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

  async addUser(email, nom, prenom, telephone, status) {
    let pgRes = await this.users.addUser(email, nom, prenom, telephone, status);
    return [pgRes[0], pgRes[1]];
  }

  async updateUser(email, nom, prenom, telephone) {
    let pgRes = await this.users.updateUser(email, nom, prenom, telephone);
    return [pgRes[0], pgRes[1]];
  }

  async updateUserStatus(email, status) {
    let pgRes = await this.users.updateUserStatus(email, status);
    return [pgRes[0], pgRes[1]];
  }

  async removeUser(email) {
    let pgRes = await this.users.removeUser(email);
    return [pgRes[0], pgRes[1]];
  }
  /*
  ** USERS:END
  */


  /*
  ** CREDENTIALS:BEGIN
  */
  async autoLogin(ip) {
    let pgRes = await this.creds.autoLogin(ip);
    return [pgRes[0], pgRes[1]];
  }

  async login(email, psw, ip) {
    let pgRes = await this.creds.login(email, psw, ip);
    return [pgRes[0], pgRes[1]];
  }

  async addCred(email, psw, status) {
    let pgRes = await this.creds.addCred(email, psw, status);
    return [pgRes[0], pgRes[1]];
  }

  async updateCredPsw(email, psw) {
    let pgRes = await this.creds.updateCredPsw(email, psw);
    return [pgRes[0], pgRes[1]];
  }

  async updateCredStatus(email, status) {
    let pgRes = await this.creds.updateCredStatus(email, status);
    return [pgRes[0], pgRes[1]];
  }

  async removeCred(email) {
    let pgRes = await this.creds.removeCred(email);
    return [pgRes[0], pgRes[1]];
  }
  /*
  ** CREDENTIALS:END
  */
}
/*
** END OF FILE
*/