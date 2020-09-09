import React, { useEffect, useState } from 'react';
import { Container, Heading, Hero, Button, Loader } from 'react-bulma-components';
import { Footer } from '../components'
import { useHistory } from 'react-router-dom';
import { getToken, endSession } from '../session';
import axios from 'axios';
import * as Colyseus from 'colyseus.js';

const Game = (props) => {

  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');

  const leaveGame = () => {
    endSession();
    history.push('/');
  }

  useEffect(() => {
    console.log(getToken());
    axios.post('http://localhost:9000/getGame', {token: getToken()})
    .then(res => {
        console.log(res);
        setCode(res.data.code);
        setLoading(false);
    })
    .catch(err => {
      if (err && err.response) {
        // setError(err.response.data);
        console.log(err.response.data);
        }
        endSession();
        history.push('/')
    });
  }, []);


  const gameContent = () => {
    return (
        <Container>
            <Heading>Code: {code}</Heading>
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
        </Container>
      </Hero.Body>
      <Hero.Footer>
        <Footer />
      </Hero.Footer>
    </Hero>
  );
}

export default Game;
