import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function App() {
  return (

    <div className="App">
      <header className="App-header">
        <h1>Mafia Helper</h1>
        <div>
          <Button>Create Game</Button>
          <Form> 
          Join Game
            <input type="text"></input>
             </Form>
        </div>
      </header>
    </div>
  );
}

export default App;
