import React from 'react';
import { Button, Container, Heading, Hero, Level } from 'react-bulma-components';
import {Footer} from '../components'
import axios from 'axios';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true, gameParams: {}};
  }

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.newGame) {
        axios.post('http://localhost:9000/createGame', state.newGame)
        .then(res => {
            console.log(res);
            this.setState({loading: false});
            window.history.replaceState('', null); // clear newGame params on refresh
        });
    }
    else {
        this.setState({loading: false});
    }
  }

  render() {
      console.log(this.props)
      return (
        <Hero className="App">
          <Hero.Head renderAs="header"> 
          <Heading>{this.state.code}</Heading></Hero.Head>
          <Hero.Body>
            <Container className="main">
            
            </Container>
          </Hero.Body>
          <Hero.Footer>
            <Footer/>
          </Hero.Footer>
        </Hero>
      );
    }
  }



export default Game;
