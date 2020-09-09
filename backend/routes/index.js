const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Game = require('../models/Game'); 
const Role = require('../models/Role'); 
const jwt = require('jsonwebtoken');
const creds = require('../creds.json');
const Mafia = require('../mafia');

router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/createGame', async function(req, res, next) {
    const {code, players, roles, numMafia} = req.body;
    if (!code || !players) {
      res.status(400).send('Missing required parameter to start game');
      return;
    }
    // const game = new Game({code, numPlayers: players, numMafia, players: [], roles: roles.map(a => ({id: a.id, qty: a.qty}))});
    // game.save().then((result) => {
    //   res.status(201).send(`Successfully created game with code ${code}`);
    // })
    // .catch(err => {
    //   let message = "Something went wrong creating game";
    //   if (err.code === 11000) {
    //     message = "Game with that code already exists";
    //   }
    //   res.status(400).send(message);
    // });
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
  const {token} = req.body;
  if (!token) {
    res.status(401).send('You are not currently in a game');
  }
  else {
    jwt.verify(token, creds.secret, (err, decoded) => {
      if (err) {
        res.status(400).send("Game token invalid");
      }
      else {
        const {code} = decoded.data;
        if (!code) {
          res.status(400).send('Missing game code');
        }
        else {
          const game = Mafia.getGame(code);
          if (!game) {
            res.status(404).send(`Game with code ${code} not found`);
          }
          else {
            res.send({...game, code});
          }
        }
      }
    });
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
