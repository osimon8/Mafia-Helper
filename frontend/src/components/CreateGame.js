import React from 'react';
import { Button, Container, Level, Form } from 'react-bulma-components';
import { Link } from "react-router-dom";
import { CreateSetup } from '../components';

const { Label, Input, Field, Control, Select } = Form;

const MIN_PLAYERS = 7;

class CreateGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = { code: '', players: MIN_PLAYERS, setup: '', roles: {} };
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


    generateOptions() {
        let options = [];
        for (let i = MIN_PLAYERS; i <= 20; ++i) {
            options.push(i);
        }
        return options.map(i => <option key={i}>{i}</option>);
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
                <Field horizontal={true}>
                    <Label>Players: &nbsp;</Label>
                    <Field.Body>
                        <Control>
                            <Select onChange={this.handleChange} value={this.state.players} name="players">
                                {this.generateOptions()}
                            </Select>
                        </Control>
                    </Field.Body>
                </Field>
                <Field>
                    <Label>Setup</Label>
                    <CreateSetup numPlayers={this.state.players} />
                </Field>
                <Level>
                    <Level.Item align="center">
                        <Link to={{ pathname: `/${this.state.code}`, state: { newGame: this.state } }}>
                            <Button color="success">Create!</Button>
                        </Link>
                    </Level.Item>
                </Level>

            </Container>
        );
    }
}



export default CreateGame;
