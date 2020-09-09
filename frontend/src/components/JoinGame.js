import React, { useState } from 'react';
import { Container, Form, Level, Button } from 'react-bulma-components';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import {Error} from '../components';
import {startSession} from '../session';

const { Label, Input, Field, Control } = Form;

const JoinGame = (props) => {
    const {client} = props;

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const history = useHistory();

    const handleSubmit = (event) => {
        client.joinById(code).then(res => console.log(res));
        // axios.post('http://localhost:9000/joinGame', { code, name })
        //     .then(res => {
        //         startSession(res.data);
        //         history.push('/game');
        //     })
        //     .catch(err => {
        //         if (err && err.response) {
        //             setError(err.response.data);
        //         }
        //     });
    };

    return (
        <Container className="form">
            <Field>
                <Label>Join Game</Label>
                <Control>
                    <Input onChange={(e) => setCode(e.target.value)} value={code} type="text" placeholder="Room Code" name="code" />
                </Control>
            </Field>
            <Field>
                <Label>Name</Label>
                <Control>
                    <Input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="e.g. Player1" name="name" />
                </Control>
            </Field>
            <Error error={error}/>
            <Level>
                <Level.Item align="center">
                    <Button color="success" onClick={handleSubmit}>Join</Button>
                </Level.Item>
            </Level>
        </Container>
    );
}



export default JoinGame;