import React from 'react';
import './App.css';
import {Home, Game} from './components'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import history from "./history";
import Cookies from 'js-cookie';
import * as Colyseus from 'colyseus.js';

const App = () => {
      const client = new Colyseus.Client('ws://localhost:4000');

      return (
        <Router>
          <Switch>
            {/* <Route exact path="/" render={() => <Home/>}> 
              </Route> */}
              <Route exact path="/" render={() => Cookies.get('token') ? <Redirect to="game"/> :
                     <Home client={client} />}> 
              </Route>
              <Route path="/game" render={() => !Cookies.get('token') ? <Redirect to="/"/> :
                     <Game client={client}/>}></Route>
          </Switch>
        </Router>
      );
    }

export default App;
