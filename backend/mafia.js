const games = new Map();


const registerGame = (code, params) => {
    games.set(code, {...params, players: []});
};  

const getGame = (code) => {
    if (!gameExists(code)) {
        return null;
    }
    return games.get(code);
}

const joinGame = (code, name, token) => {
    if (!gameExists(code)) {
        return `Game with code ${code} doesn't exist`;
    }
    getGame(code).players.push({name, token});
}

const gameExists = (code) => {
    return games.has(code);
}

const assignRoles = (code) => {

}; 

const Mafia = {
    registerGame,
    getGame,
    joinGame,
    assignRoles,
    gameExists
};

module.exports = Mafia;