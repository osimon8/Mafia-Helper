import {Schema, MapSchema, ArraySchema, type, filter}from "@colyseus/schema";
import {Client} from 'colyseus';


class Action extends Schema {
    @type('string')
    description: string = '';

    @type('int8')
    uses: number = -1;

    @type(['string'])
    history = new ArraySchema<string>();
}

class Role extends Schema {
    @type('string')
    name: string = '';

    @type('string')
    description: string = '';

    @type(Action)
    nightAction?: Action;

    @type(Action)
    deathAction?: Action;

    @type('string')
    alignment: string = 'Town';

    @type('uint8')
    qty: number = 0;

}


class Player extends Schema {
    @type('string')
    name: string = 'Benedict';

    // @type('boolean')
    // god = false;
    @type(Role)
    role?: Role; 

    @type('string')
    alignment: string = 'Town';
}


class Event extends Schema {
    @type('string')
    text: string = '';
}

class State extends Schema {
    @type("string")
    code : string = '';

    @type({ map: 'string' })
    playerNames = new MapSchema<string>();

    @filter(function (this: State, client: Client, value?: State['players'], root?: Schema) {
        return Object.keys(this.gods).some(x => x === client.sessionId);
    })
    @type({map: Player})
    players = new MapSchema<Player>();

    @type({map: Player})
    deadPlayers = new MapSchema<Player>();

    @type('uint8')
    numPlayers: number = 0;

    @type('uint8')
    numMafia: number = 0;

    @type([Role])
    roles = new ArraySchema<Role>();

    @type('uint8')
    turn : number = 0;

    @type([Event])
    eventLog = new ArraySchema<Event>();

    @type({map: 'boolean'})
    gods = new MapSchema<Boolean>();

    @type('string')
    phase: string = 'waiting';

    @type('uint8')
    nightPhases: number = 2;

    @type('uint8')
    nightPhase: number = 0;

}

export {Player, Role, State, Action, Event};