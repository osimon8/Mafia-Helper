import React, { useEffect, useState, useRef } from 'react';
import { Container, Heading, Hero, Button, Loader, Section, Columns } from 'react-bulma-components';
import { Footer, Alignment } from '../components'
import { useHistory } from 'react-router-dom';
import { Players, EventLog, Chat } from './gameComponents';

const Game = (props) => {

  const { room } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [players, setPlayers] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [numMafia, setNumMafia] = useState(0);
  const [roles, setRoles] = useState([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState("waiting");
  const [events, setEvents] = useState([]);
  const [god, _setGod] = useState(false);
  const [player, setPlayer] = useState(null);
  const [messages, _setMessages] = useState([]);
  const messagesRef = useRef(messages);
  const godRef = useRef(god);

  const parseSchema = (value, keyName = 'key', valueName = 'value') => {
    const values = Object.values(value.toJSON());
    const keys = Object.keys(value.toJSON());
    return values.map((v, i) => {
      return typeof (v) === 'object' ? { ...v, [keyName]: keys[i] } : { [valueName]: v, [keyName]: keys[i] };
    })
  }

  const setMessages = (messages) => {
    messagesRef.current = messages;
    _setMessages(messages);
  }

  const setGod = (god) => {
    godRef.current = god;
    _setGod(god);
  }

  const addMessage = (sender, text) => {
    const arr = [...messagesRef.current];
    const msg = {
      sender,
      text
    }
    arr.push(msg);
    setMessages(arr);
  };


  const initRoom = () => {

    room.state.onChange = (changes) => {
      // console.log(changes);
      changes.forEach(change => {
        const { field, value } = change;
        switch (field) {
          case "code":
            setCode(value);
            break;
          case "players":
            setPlayers(parseSchema(value, 'id'));
            break;
          case "playerNames":
            setPlayerNames(parseSchema(value, 'id', 'name'));
            break;
          case "roles":
            setRoles([...Object.values(value.toJSON())]);
            break;
          case "turn":
            setTurn(value);
            break;
          case "numPlayers":
            setNumPlayers(value);
            break;
          case "numMafia":
            setNumMafia(value);
            break;
          case "phase":
            setPhase(value);
            break;
          case "eventLog":
            setEvents([...Object.values(value.toJSON())]);
            break;
          case "gods":
            const arr = [...Object.keys(value.toJSON())];
            if (arr.some(x => x === room.sessionId)) {
              setGod(true);
            }
            break;
          default:
            break;
        }
      });
    };

    // room.onMessage("messages", (message) => {
    //   console.log("message received from server");
    //   console.log(message);
    // });

    room.onMessage('role', player => {
      setPlayer(player);
    });

    
    room.onMessage('message', (message) => {
      if (!godRef) {
        addMessage('God', message.text);
      }
      else {
        addMessage(message.sender.name, message.text);
      }
    });



    const onLeave = () => {
      history.push('/');
    }

    room.onError(onLeave);
    room.onLeave(onLeave);

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
    else {
      history.push('/');
    }
  }

  const TurnDisplay = () => {
    let msg;
    switch (phase) {
      case "waiting":
        msg = `Waiting for players (${playerNames.length}/${numPlayers})`;
        break;
      case "ready":
        msg = `Ready to start`;
        break;
      default:
        msg = `${turn % 2 === 0 ? 'Night' : 'Day'} ${Math.floor(turn / 2) + 1}`;
        break;
    }

    let el = <Container>
      <Heading>{msg}</Heading>
    </Container>;

    if (phase === "ready" && god) {
      el = <Container>
        <Heading>{msg}</Heading>
        <Button color='success' onClick={() => room.send("start")}>Start</Button>
      </Container>;
    }

    return el;
  }

  const isDead = () => {
    return !god && !playerNames.some(x => x.id === room.sessionId);
  }

  const RoleDisp = () => {
    if (god || !player) {
      return <span />;
    }
    else if (isDead()) {
      return <Heading size={3}>You are dead</Heading>;
    }
    const { role, alignment } = player;
    const vT = 'You are just a regular member of the town. You have no special actions.'
    const vM = 'You are a regular member of the mafia. Each night, choose someone to kill along with the rest of your mafia team.'

    const roleM = `${role ? `Role: ${role.name}` : ''}`;
    const alignM = <p>Alignment: <Alignment alignment={alignment} /></p>
    const desc = `${role ? role.description : (alignment === 'Town' ? vT : vM)}`;

    return <Container>

      <Heading size={3}>
        {alignM} &emsp; {roleM}
      </Heading>
      <Heading subtitle size={6} renderAs="h2">
        {desc}
      </Heading>

    </Container>
  }

  const gameStarted = () => {
    return phase !== 'waiting' && phase !== 'ready';
  }


  //TODO: Fix stacking order of columns on mobile, something like this
  /*
    @media(max-width: $tablet) {
      .columns.is-reversed-mobile {
        flex-direction: column-reverse;
        display: flex;
      }
    }
  */

  const GameContent = () => {
    return (
      <Container fluid={true}>
        <Container style={{ marginBottom: '1rem' }}>
          <Heading>Code: {code}</Heading>
          <Heading subtitle renderAs="h2">Roles: {roles.map((x, i) => `${x.name}${x.qty > 1 ? ` (${x.qty})` : ''}${i < roles.length - 1 ? ', ' : ''}`)}</Heading>
          <Heading subtitle renderAs="h3">Mafia: {numMafia}</Heading>
          <RoleDisp />
          <TurnDisplay />
        </Container>
        <Columns>
          <Columns.Column size={3}>
            <EventLog events={events} />
          </Columns.Column>
          <Columns.Column>
            <Container>
              <Players players={players} playerNames={playerNames} ready={gameStarted()} room={room}></Players>
            </Container>
          </Columns.Column>
          <Columns.Column size={3}>
            <Chat room={room} god={god} addMessage={addMessage} messages={messages} />
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
