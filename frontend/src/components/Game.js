import React, { useEffect, useState } from 'react';
import { Container, Heading, Hero, Button, Loader } from 'react-bulma-components';
import { Footer } from '../components'
import { useHistory } from 'react-router-dom';
import { getToken, endSession } from '../session';
import axios from 'axios';
import * as Colyseus from 'colyseus.js';
import {Players} from './gameComponents';

const Game = (props) => {

  const {room} = props;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState([]);


  const initRoom = () => {

    room.state.onChange = (changes) => {
        console.log(changes);
        changes.forEach(change => {
            const {field, value, previousValue} = change;
            switch(field) {
              case "code":
                setCode(value);
                break;
              case "players":
                setPlayers([...Object.values(value.toJSON())]);
                break;
              case "roles":
                setRoles([...Object.values(value.toJSON())]);
                break;
            }
        });
    };

    room.onMessage("messages", (message) => {
        console.log("message received from server");
        console.log(message);
      });

}

  useEffect(() => {
    if (room) {
      initRoom();
      setLoading(false);
    }
  }, [])

  const leaveGame = () => {
    //endSession();
    if (room) {
      room.leave();
    }
    history.push('/');
  }

  const logRoom = () => {
    console.log(room);
  }


  const gameContent = () => {
    return (
        <Container>
            <Heading>Code: {code}</Heading>
            <Heading subtitle>Roles: {roles.map((x, i )=> `${x.name}${x.qty > 1 ? ` (${x.qty})` : ''}${i < roles.length - 1 ? ', ' : ''}`)}</Heading>
            <Players players={players}></Players>
          </Container>);
  };

  return (
    <Hero className="App">
      <Hero.Head renderAs="header">
        <Heading>{props.code}</Heading></Hero.Head>
      <Hero.Body>
        {loading ? <Loader/> : gameContent()}
        <Container className="main">
          <Button color="danger" onClick={leaveGame}>Leave</Button>
          <Button color="primary" onClick={logRoom}>Print Room</Button>
        </Container>
      </Hero.Body>
      <Hero.Footer>
        <Footer />
      </Hero.Footer>
    </Hero>
  );
}

export default Game;
