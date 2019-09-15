const db=require('../sequelize/connection');
var Sequelize = require('sequelize');
const user= db.define('user', {
    Name: {
      type: Sequelize.STRING,
      primaryKey:true,
      allowNull:false
    },
    
  });
   
  module.exports = user;