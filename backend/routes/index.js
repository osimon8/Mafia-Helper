const express = require('express');
const router = express.Router();
const Game = require('../models/Game'); 

router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/createGame', function(req, res, next) {
    console.log(req.body);
    res.send('test');
  });

module.exports = router;
