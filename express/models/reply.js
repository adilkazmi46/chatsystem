const db=require('../sequelize/connection');
const user=require('./user');
const inbox=require('./inbox');
var Sequelize = require('sequelize');
const reply= db.define('reply', {
    Message:{
        type:Sequelize.TEXT, 
        allowNull:false 
    },
    time:{
        type:Sequelize.STRING,  
        allowNull:false, 
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    date:{
        type:Sequelize.STRING,
        allowNull:false
    },
    seen_time:{
       type:Sequelize.STRING,
       allowNull:true,
    }

  }); 
  reply.belongsTo(user,{foreignKey: 'user_name', });
  reply.belongsTo(inbox,{foreignKey: 'inbox_id', });
  module.exports =reply;  

      
     
           