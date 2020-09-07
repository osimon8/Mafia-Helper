import React from 'react';
import { Button, Container, Level, Form } from 'react-bulma-components';
import { Link } from "react-router-dom";

const { Label, Input, Field, Control, Select } = Form;

class CreateGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = { code: '', players: '', setup:''};
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
                        <Label>Room Code</Label>
                        <Control>
                            <Input onChange={this.handleChange} value={this.state.code} type="text" placeholder="e.g. Group1" name="code" />
                        </Control>
                    </Field>
                    <Field>
                        <Label>Players</Label>
                        <Control>
                            <Input onChange={this.handleChange} value={this.state.players} type="text" placeholder="Enter the number of players" name="players" />
                        </Control>
                    </Field>
                    <Field>
                        <Label>Setup</Label>
                        <Control>
                            <Select onChange={this.handleChange} value={this.state.setup} name="setup">
                                <option>Select Setup</option>
                                <option>Fancy Pants</option>
                                <option>Custom</option>
                            </Select>
                        </Control>
                    </Field>
                    <Level>
                        <Level.Item align="center">
                            <Link to={{pathname: `/${this.state.code}`, state: {newGame: this.state}}}>
                                <Button color="success">Create!</Button>
                            </Link>
                        </Level.Item>
                    </Level>

                </Container>
        );
    }
}



export default CreateGame;
