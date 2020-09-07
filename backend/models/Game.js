const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {type: String, required: true},
    alignment: {type: String, required: true},
    role: String
});


const gameSchema = new Schema({
    code: {type: String, unique: true, required: true},
    numPlayers: {type: Number, required: true},
    turn: {type: Number, default: 0},
    players: [playerSchema]
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;