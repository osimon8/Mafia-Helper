const map = new Map();

const registerGame = (code: string, id: string) => {
    if (!gameExists(code)) {
        map.set(code, id);
    }
};  

const getId = (code: string) => {
    if (!gameExists(code)) {
        return null;
    }
    return map.get(code);
}

const deleteGame = (code: string) => {
    map.delete(code);
}

const gameExists = (code: string) => {
    return map.has(code);
}

export {registerGame, getId, deleteGame, gameExists};