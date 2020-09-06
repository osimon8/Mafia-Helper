import React from 'react';
import './App.css';
import {Home, Game} from './components'
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
      return (
        <Router>
            <Route exact path="/" component={Home}></Route>
            <Route path="/game" component={Game}></Route>
        </Router>

      );
    }
  }



export default App;
