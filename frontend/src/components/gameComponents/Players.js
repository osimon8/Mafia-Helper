import React, { useState } from 'react';
import { Button, Container, Level, Form, Tile, Box, Columns, Heading } from 'react-bulma-components';
// import { CreateSetup, Error } from '../../components';

const PlayerTile = (props) => {

    // return <Tile >//style={{'backgroundColor': 'gray'}}>
    return <Box style={{'backgroundColor': 'light-gray'}}>
            <Heading size={4}>{props.name}</Heading>
        </Box>;
}


const Players = (props) => {

    const {players} = props;

    const renderTiles = () => {
        const columns = [];
        const numColumns = 4;

        for (let i = 0; i < numColumns; ++i) {
            columns[i] = [];
        }

        players.forEach((player, i) => {
            if (!player.god) {
                columns[i % numColumns].push(<PlayerTile key={i} name={player.name}/>);
            }
        });

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
