import React from 'react';
import { Container, Heading, Hero } from 'react-bulma-components';
import { Footer } from '../components'

const Game = (props) => {

  return (
    <Hero className="App">
      <Hero.Head renderAs="header">
        <Heading>{this.state.code}</Heading></Hero.Head>
      <Hero.Body>
        <Container className="main">

        </Container>
      </Hero.Body>
      <Hero.Footer>
        <Footer />
      </Hero.Footer>
    </Hero>
  );
}

export default Game;
