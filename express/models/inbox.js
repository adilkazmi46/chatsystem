const db=require('../sequelize/connection');
var Sequelize = require('sequelize');
const user=require('./user');  
const inbox= db.define('inbox', {
  });
  inbox.belongsTo(user,{foreignKey: 'user_1', });
  inbox.belongsTo(user,{foreignKey: 'user_2', });  
  module.exports =inbox;  

      
     
