const express = require('express');
const usersRouter = express.Router();
const { getUserInfo} = require('../controllers/users');


usersRouter.get('/me', getUserInfo);


module.exports = usersRouter;