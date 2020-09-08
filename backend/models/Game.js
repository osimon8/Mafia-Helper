const mongoose = require('mongoose');
const Role = require('./Role');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: { type: String, required: true },
    // alignment: {type: String, required: true},
    role: { type: Schema.ObjectId, ref: 'Role', required: true },
    roleRevealed: { type: Boolean, default: false }
});


const gameSchema = new Schema({
    code: { type: String, unique: true, required: true },
    numPlayers: { type: Number, required: true },
    numMafia: {type: Number, required: true},
    turn: { type: Number, default: 0 },
    players: [playerSchema],
    roles: [{role: { type: Schema.ObjectId, ref: 'Role'}, qty: {type: Number, default: 1}}]
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

gameSchema.methods.getMafia = () => {
    return this.players.populate('Role')
        .then((joined) => {
            return joined;
    });
};

module.exports = Game;