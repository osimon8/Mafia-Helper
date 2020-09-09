import React from 'react';
import './App.css';
import {Home, Game} from './components'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import history from "./history";
import Cookies from 'js-cookie';

const App = () => {
      return (
        <Router>
          <Switch>
            {/* <Route exact path="/" render={() => <Home/>}> 
              </Route> */}
              <Route exact path="/" render={() => Cookies.get('token') ? <Redirect to="game"/> :
                     <Home/>}> 
              </Route>
              <Route path="/game" render={() => !Cookies.get('token') ? <Redirect to="/"/> :
                     <Game/>}></Route>
          </Switch>
        </Router>
      );
    }

export default App;
