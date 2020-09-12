import {Room, Client} from 'colyseus';
import {Player, State, Role, Action, Event} from './State';
import {registerGame, deleteGame, gameExists} from './RoomMap';
const mongoose = require('mongoose');
const RoleModel = mongoose.model('Role');

class Mafia extends Room<State> {
    // this room supports only 4 clients connected
    // maxClients = 4;

    onCreate (options: any) {
        console.log("Game created!", options);

        this.setState(new State());

        const {roles, numPlayers, numMafia} = options;
        let valid;
        

        if (roles) {
            RoleModel.find({'_id': {$in: roles.map((x: any) => x._id)}}).then(
                (res: any) => {
                    res.forEach((x: any) => {
                        const role = new Role();
                        role.alignment = x.alignment;
                        if (x.nightAction) {
                            role.nightAction = new Action();
                            role.nightAction.description = x.nightAction.description;
                        }
                        role.description = x.description;
                        role.name = x.name;  
                        role.qty = roles.filter((y: any) => ''+x._id === y._id)[0].qty;
                        this.state.roles.push(role);
                    });
                    valid = this.validateRoles(numMafia, numPlayers);
                    if (!valid) {
                        // throw new Error('Invalid role configuration, ensure that the number of roles for each alignment adds up to less than or equal the number of players of that alignment');
                        this.disconnect();
                    }
                }

            ) // .catch((err: any) => {error = err;});
        }


        const code = options.code || this.roomId;

        if (gameExists(code)) {
            throw new Error(`Game with code "${code}" already exists.`);
        }

        this.state.code = code;
        this.state.numPlayers = numPlayers;
        this.state.numMafia = numMafia;
        registerGame(code, this.roomId);

        let event = new Event();
        event.text = `Game created with code "${code}"`;
        this.state.eventLog.push(event);

        this.onMessage("start", (client : Client) => {
            if (this.state.phase === "ready" && this.isGod(client) && this.gameFull()) {
                this.assignRoles();
                this.state.phase = 'night';
                this.clients.filter(c => !this.isGod(c)).forEach((c: Client) => {
                    c.send('role', this.state.players[c.sessionId]);
                });
            }
            // console.log("ChatRoom received message from", client.sessionId, ":", message);
            // this.broadcast("messages", `(${client.sessionId}) ${message}`);
        });


        this.onMessage("kill", (client: Client, target: string) => {
            if (this.isGod(client)) {
                const player = this.state.players[target];
                if (player) {
                    this.state.deadPlayers[target] = player;
                    event = new Event();
                    event.text = `${player.name} was killed! They were aligned with the ${player.alignment}`;
                    this.state.eventLog.push(event);
                    --this.state.numPlayers;
                    if (player.alignment === 'Mafia') {
                        --this.state.numMafia;
                    }
                    delete this.state.players[target];
                    delete this.state.playerNames[target];
                }
            }
        });

        
        this.onMessage("message", (client: Client, text: string) => {
            if (!this.isGod(client)) {
                const sender = this.state.players[client.sessionId];
                if (sender) {
                    this.clients.filter(c => this.isGod(c)).forEach((c: Client) => {
                        c.send('message', {sender, text});
                    });
                }
            }
            else {
                this.clients.filter(c => !this.isGod(c)).forEach((c: Client) => {
                    c.send('message', {sender: {name: 'God'}, text});
                });
            }
        });

    }

    onJoin(client: Client, options: any) {
        const {name, god} = options;

        if (god) {
            this.state.gods[client.sessionId] = true;
        }
        else if (this.gameFull()) {
            // game is full
            client.leave();
        }
        else {
            const player: Player = new Player();
            if (name) {
                player.name = name;
            }
            this.state.players[client.sessionId] = player;
            this.state.playerNames[client.sessionId] = player.name;
            const event = new Event();
            event.text = `${ player.name} joined`;
            this.state.eventLog.push(event);

            if (this.gameFull()) {
                // game is ready!
                this.state.phase = 'ready';
            }
        }

        // const msg = god ? `God (${ player.name}) has joined.`: `${ player.name} joined.`

        //this.broadcast("messages", msg);
      }

    onLeave (client: Client) {
        if (!this.isGod(client) && this.state.players[client.sessionId]) {
            const {name} = this.state.players[client.sessionId];
            const event = new Event();
            event.text = `${ name} left`;
            this.state.eventLog.push(event);
            delete this.state.players[client.sessionId];
            delete this.state.playerNames[client.sessionId];
        }
        else {
            delete this.state.gods[client.sessionId];
        }
    }

    onDispose () {
        console.log(`Dispose Game with code ${this.state.code}`);
        deleteGame(this.state.code);
    }

    isGod(client : Client) {
        return Object.keys(this.state.gods).some(x => x === client.sessionId);
    }

    assignRoles() {
        const {roles, numMafia, numPlayers, players} = this.state;
        let i : number;

        //returns a shuffled array of the input array
        const shuffle = (arr : Array<any>) => {
            let array : Array<any> = [...arr];
            for(i = array.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * i);
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
              }
            return array;
        }
        const assignments = shuffle(Object.keys(players));

        // first, assign mafia
        let id;

        for (i = 0; i < numMafia; ++i) {
            id = assignments[i];
            players[id].alignment = 'Mafia';
        }

        const alignments = ['Mafia', 'Town'];

        let index = 0;
        alignments.forEach(alignment => {
            const alignRoles = roles.filter(role => role.alignment === alignment);
            alignRoles.forEach(role => {
                for (i = 0; i < role.qty; ++i) {
                    id = assignments[index];
                    players[id].role = role.clone();
                    ++index;
                }
            });
            index = numMafia;
        });

    }

    gameFull() {
        return Object.keys(this.state.players).length === this.state.numPlayers;
    }

    validateRoles(numMafia: number, numPlayers: number) {
        const mafiaRoles = this.state.roles.filter(role => role.alignment === 'Mafia');
        const townRoles = this.state.roles.filter(role => role.alignment === 'Town');
        const count = (arr: Array<any>) => arr.reduce((acc, v) => acc + v.qty, 0);
        return count(mafiaRoles) <= numMafia && count(townRoles) <= numPlayers - numMafia;
    }

}

module.exports = Mafia;