import React from 'react';
import './App.css';
import {Home, Game} from './components'
import { Router, Route, Switch } from 'react-router-dom';
import history from "./history";

class App extends React.Component {

  render() {
      return (
        <Router history={history}>
            <Route exact path="/" component={Home}></Route>
            <Switch>
                <Route exact path="/game" component={Game}></Route>
            </Switch>
        </Router>
      );
    }
  }

export default App;
