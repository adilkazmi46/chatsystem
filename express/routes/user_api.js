var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/user_controller');

router.get('/add_user',user_controller.add_user);
module.exports=router;