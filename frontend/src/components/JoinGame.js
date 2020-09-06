import React from 'react';
import {Container, Form, Level, Button} from 'react-bulma-components';
import { Link } from "react-router-dom";

const { Label, Input, Field, Control} = Form;

class JoinGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = { code: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
                <Container className="form">
                <Field>
                    <Label>Join Game</Label>
                    <Control>
                      <Input onChange={this.handleChange} value={this.state.code} type="text" placeholder="Room Code" name="code"/>
                    </Control>
                  </Field>
                  <Level>
                    <Level.Item align="center">
                        <Link to="/game">
                        <   Button color="success">Join</Button>
                        </Link>
                    </Level.Item>
                </Level>
                </Container>
        );
    }
}



export default JoinGame;