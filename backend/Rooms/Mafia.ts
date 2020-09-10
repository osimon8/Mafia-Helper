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

        const {roles} = options;
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
                }

            ).catch((err: any) => console.log(err));
        }

        const code = options.code || this.roomId;

        if (gameExists(code)) {
            throw new Error(`Game with code "${code}" already exists.`);
        }

        this.state.code = code
        registerGame(code, this.roomId);

        const event = new Event();
        event.text = `Game created with code "${code}"`;
        this.state.eventLog.push(event);
        
        this.onMessage("message", (client, message) => {
            console.log("ChatRoom received message from", client.sessionId, ":", message);
            this.broadcast("messages", `(${client.sessionId}) ${message}`);
        });
    }

    onJoin(client: Client, options: any) {
        const {name, god} = options;
        const player: Player = new Player();
        if (name) {
            player.name = name;
        }
        if (god) {
            player.god = true;
        }
        this.state.players[client.sessionId] = player;

        // const msg = god ? `God (${ player.name}) has joined.`: `${ player.name} joined.`
        if (!god) {
            const event = new Event();
            event.text = `${ player.name} joined`;
            this.state.eventLog.push(event);
        }


        //this.broadcast("messages", msg);
      }

    onLeave (client: Client) {
        const {name, god} = this.state.players[client.sessionId];

        // const msg = god ? `God (${ player.name}) has joined.`: `${ player.name} joined.`
        if (!god) {
            const event = new Event();
            event.text = `${ name} left`;
            this.state.eventLog.push(event);
        }

        delete this.state.players[client.sessionId];
    }

    onDispose () {
        console.log(`Dispose Game with code ${this.state.code}`);
        deleteGame(this.state.code);
    }

}

module.exports = Mafia;