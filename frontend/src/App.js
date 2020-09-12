import React, {useState} from 'react';
import './App.css';
import {Home, Game} from './components'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as Colyseus from 'colyseus.js';

const App = () => {
      const client = new Colyseus.Client('ws://localhost:4000');
      const [room, setRoom] = useState(null);

      return (
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Home client={client} room={room} setRoom={setRoom}/>}> 
              </Route>
              {/* <Route exact path="/" render={() => room ? <Redirect to="game"/> :
                     <Home client={client} room={room} setRoom={setRoom} />}> 
              </Route> */}
              {/* <Route path="/game" render={() => !Cookies.get('token') ? <Redirect to="/"/> :
                     <Game client={client}/>}></Route> */}
                    {/* <Route path="/game" render={() => !room ? <Redirect to="/"/> :
                     <Game client={client} room={room} setRoom={setRoom}/>}></Route> */}
              <Route path="/game" render={() => <Game client={client} room={room} setRoom={setRoom}/>}></Route>
          </Switch>
        </Router>
      );
    }

export default App;
