const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Game = require('../models/Game'); 
const Role = require('../models/Role'); 

router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/createGame', function(req, res, next) {
    const {code, players, roles} = req.body;
    console.log(roles)
    if (!code || !players) {
      res.status(400).send('Missing required parameter to start game');
      return;
    }
    res.send('test');
});

router.post('/createRole', (req, res) => {
  let {name, description, nightAction, deathAction, alignment} = req.body;
  if (!name) {
    res.status(400).send("Role must have a name");
    return;
  }

  if (!alignment) {
    alignment = 'Town';
  }

  const role = new Role({name, description, nightAction, deathAction, alignment});

  role.save().then((result) => {
    console.log(result);
    res.send("GoOOOD");
  });

});

module.exports = router;
