import React from 'react';
import { Button, Container, Heading, Hero, Level } from 'react-bulma-components';
import {Footer, CreateGame, JoinGame} from '../components'

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {creatingGame: false};
    this.renderMain = this.renderMain.bind(this);
  }

  renderMain() {
    return this.state.creatingGame ? <CreateGame/> : <JoinGame/>;
  }

  render() {
      return (
        <Hero className="App">
          <Hero.Head renderAs="header"> </Hero.Head>
          <Hero.Body>
            <Container className="main">
              <Heading> Mafia Helper</Heading>
              <Level align="center">
                <Level.Item><Button varaint="contained" color="primary" onClick={() => this.setState({creatingGame: false})}>Join Game</Button></Level.Item>
                <Level.Item><Button varaint="contained" color="primary" onClick={() => this.setState({creatingGame: true})}>Create Game</Button></Level.Item>
              </Level>
            </Container>
            {this.renderMain()}
          </Hero.Body>
          <Hero.Footer>
            <Footer/>
          </Hero.Footer>
        </Hero>
      );
    }
  }

export default Home;
