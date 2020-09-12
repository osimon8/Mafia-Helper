import { Room } from 'colyseus.js';
import React, { useState } from 'react';
import { Button, Container, Level, Form, Tile, Box, Columns, Heading } from 'react-bulma-components';
// import { CreateSetup, Error } from '../../components';

const PlayerTile = (props) => {

    // return <Tile >//style={{'backgroundColor': 'gray'}}>
    const {name} = props;

    return <Box style={{'backgroundColor': 'lightgray'}}>
            <Heading size={4}>{name}</Heading>
            <span/>
        </Box>;
}

const PlayerTileDetailed = (props) => {

    // return <Tile >//style={{'backgroundColor': 'gray'}}>
    const {player, room} = props;
    const {name, alignment, role, id} = player;

    const backgroundColor = alignment === 'Town' ? 'lightgreen' : 'rgb(255 0 0 / 67%)';

    return <Box style={{backgroundColor}}>
            <Heading size={4}>{name}</Heading>
            {role && role.name ? <Heading subtitle size={4}>{role.name}</Heading> : <span/>}
            <Button color="danger" onClick={() => room.send('kill', id)}>Kill</Button>
        </Box>;
}


const Players = (props) => {

    const {players, playerNames, ready, room} = props;

    const renderTiles = () => {
        const columns = [];
        const numColumns = 4;

        for (let i = 0; i < numColumns; ++i) {
            columns[i] = [];
        }

        if (players && ready) {
            players.forEach((player, i) => {
                columns[i % numColumns].push(<PlayerTileDetailed key={i} player={player} room={room}/>);
            });
        }
        else {
            playerNames.forEach((player, i) => {
                columns[i % numColumns].push(<PlayerTile key={i} name={player.name}/>);
            });
        }

        return <Columns>
            {columns.map((c, i) => <Columns.Column key={i}>{c}</Columns.Column>)}
        </Columns>;
    }

    return (
        <Container>
            {renderTiles()}
        </Container>
    );

}



export default Players;
