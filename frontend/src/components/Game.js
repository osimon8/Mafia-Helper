import React, { useEffect, useState } from 'react';
import { Container, Heading, Hero, Button, Loader, Section, Columns } from 'react-bulma-components';
import { Footer } from '../components'
import { useHistory } from 'react-router-dom';
import { getToken, endSession } from '../session';
import axios from 'axios';
import * as Colyseus from 'colyseus.js';
import { Players, EventLog } from './gameComponents';

const Game = (props) => {

  const { room } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState("waiting");
  const [events, setEvents] = useState([]);

  const initRoom = () => {

    room.state.onChange = (changes) => {
      console.log(changes);
      changes.forEach(change => {
        const { field, value, previousValue } = change;
        switch (field) {
          case "code":
            setCode(value);
            break;
          case "players":
            setPlayers([...Object.values(value.toJSON())]);
            break;
          case "roles":
            setRoles([...Object.values(value.toJSON())]);
            break;
          case "turn":
            setTurn(value);
            break;
          case "phase":
            setPhase(value);
            break;
          case "events":
            setEvents([...Object.values(value.toJSON())]);
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

  const TurnDisplay = () => {
    let msg;
    if (phase === "waiting") {
      msg = `${turn % 2 == 0 ? 'Night' : 'Day'} ${Math.floor(turn / 2) + 1}`;
    }
    else {
      msg = "Waiting for players...";
    }
    return (
      <Container>
        <Heading>{msg}</Heading>
      </Container>
    );
  }

  const GameContent = () => {
    return (
      <Container breakpoint="fluid">
        <Container style={{marginBottom: '1rem'}}>
        <Heading>Code: {code}</Heading>
            <Heading subtitle>Roles: {roles.map((x, i) => `${x.name}${x.qty > 1 ? ` (${x.qty})` : ''}${i < roles.length - 1 ? ', ' : ''}`)}</Heading>
            <TurnDisplay />
        </Container>
        <Columns>
            <Columns.Column size={2}>
              <EventLog events={events} />
            </Columns.Column>
            <Columns.Column>
              <Container>
              <Players players={players}></Players>
              </Container>
            </Columns.Column>
        </Columns>
      </Container>
    );
  };

  return (
    <Hero className="App">
      <Hero.Head renderAs="header">
        <Heading>{props.code}</Heading></Hero.Head>
      <Hero.Body>
        {loading ? <Loader /> : <GameContent />}
        <Section>
          <Container className="main">
            <Button color="danger" onClick={leaveGame}>Leave</Button>
          </Container>
        </Section>
      </Hero.Body>
      <Hero.Footer>
        <Footer />
      </Hero.Footer>
    </Hero>
  );
}

export default Game;
