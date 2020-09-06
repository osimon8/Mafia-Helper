import React from 'react';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Heading, Hero, Level, Form } from 'react-bulma-components';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";
import {Footer, CreateGame, JoinGame} from '../components'

const {Label, Input, Field, Control} = Form;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {code: 'Group1'};
  }

  render() {
      return (
        <Hero className="App">
          <Hero.Head renderAs="header"> </Hero.Head>
          <Hero.Body>
            <Container className="main">
            <Heading>{this.state.code}</Heading>
            </Container>
          </Hero.Body>
          <Hero.Footer>
            <Footer/>
          </Hero.Footer>
        </Hero>
      );
    }
  }



export default App;
