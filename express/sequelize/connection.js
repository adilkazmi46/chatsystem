
var Sequelize = require('sequelize');

module.exports = new Sequelize('chat', 'root', '', {
    dialect: 'mysql'
});
