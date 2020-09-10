const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const Game = require('../models/Game'); 
const Role = require('../models/Role'); 
const jwt = require('jsonwebtoken');
const creds = require('../creds.json');
const Mafia = require('../mafia');
const {getId, gameExists} = require('../Rooms/RoomMap');

router.post('/createGame', async (req, res) => {
    const {code, players, roles, numMafia} = req.body;
    if (!code || !players) {
      res.status(400).send('Missing required parameter to start game');
      return;
    }
    Mafia.registerGame(code, {players, roles, numMafia});
    const token = jwt.sign({
      data: {
        code,
        god: true
      }
    }, creds.secret, {expiresIn: '24h'});
    res.send(token);
});

router.post('/joinGame', async (req, res) => {
  const {code, name} = req.body;
  if (!code) {
    res.status(400).send('Missing game code');
  }
  else if (!name) {
    res.status(400).send('A name is required to join a game');
  }
  else {
    const token = jwt.sign({
      data: {
        code
      }
    }, creds.secret, {expiresIn: '24h'});
    const err = Mafia.joinGame(code, name, token);
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.send(token);
    }
  }
});

router.post('/getGame', async (req,res) => {
  const {code} = req.body;
  if (!code) {
    res.status(400).send('Missing game code');
  }
  else if (!gameExists(code)) {
    res.status(404).send(`Game with code "${code}" does not exist`);
  }
  else {
    res.send(getId(code));
  }

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

  role.save()
  .then(result => {
    res.status(201).send("Role successfully created");
  })
  .catch(err => {
    let message = "Something went wrong creating role";
    if (err.code === 11000) {
      message = "Role with that name already exists";
    }
    res.status(400).send(message);
  });
});

router.get('/getRoles', (req, res) => {
  Role.find({}).then((data) => {
    res.json(data);
  }).catch(err => res.status(400).send("Something went wrong"));
});

module.exports = router;
