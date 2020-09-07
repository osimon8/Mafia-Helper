import React from 'react';
import './App.css';
import {Home, Game} from './components'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {

  render() {

      return (
        <Router>
            <Route exact path="/" component={Home}></Route>
            <Switch>
                <Route path="/:code" component={Game}></Route>
            </Switch>
        </Router>

      );
    }
  }




export default App;
