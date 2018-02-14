const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const sequelize = dbconfig;

const Client = sequelize.define('Clients', {
  ID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'ID',
    }
  }
}, { timestamps: false, freezeTableName: true });

module.exports = Client;