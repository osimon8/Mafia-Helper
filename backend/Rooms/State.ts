import {Schema, MapSchema, ArraySchema, type}from "@colyseus/schema";


class Player extends Schema {
    @type('string')
    name: string = 'Benedict';

    @type('boolean')
    god = false;
}

class Action extends Schema {
    @type('string')
    description: string = '';

    @type('int8')
    useLimit: number = -1;
}

class Event extends Schema {
    @type('string')
    text: string = '';
}

class Role extends Schema {
    @type('string')
    name: string = '';

    @type('string')
    description: string = '';

    @type(Action)
    nightAction: Action | null = null;

    @type(Action)
    deathAction: Action | null = null;

    @type('string')
    alignment: string = 'Town';

    @type('uint8')
    qty: number = 0;

}


class State extends Schema {
    @type("string")
    code : string = '';

    @type({ map: Player })
    players = new MapSchema<Player>();

    @type([Role])
    roles = new ArraySchema<Role>();

    @type('uint8')
    turn : number = 0;
}

export {Player, Role, State, Action, Event};