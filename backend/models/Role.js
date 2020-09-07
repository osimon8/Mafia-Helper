const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nightActionSchema = new Schema({
    useLimit: {type: Number, default: -1},
    required: {type: Boolean, default: false},
    description: String
});

const roleSchema = new Schema({
    name: {type: String, required: true, unique: true, dropDups: true},
    alignment: {type: String, required: true},
    nightAction: [nightActionSchema],
    deathAction: [],
    description: String
});


const Role = mongoose.model('Role', roleSchema);

roleSchema.methods.isMafia = () => {
    return this.alignment === 'Mafia';
}

module.exports = Role;