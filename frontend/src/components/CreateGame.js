import React, { useState } from 'react';
import { Button, Container, Level, Form } from 'react-bulma-components';
// import history from "../history";
import { CreateSetup, Error } from '../components';
import { useHistory } from 'react-router-dom';

const { Label, Input, Field, Control, Select } = Form;

const MIN_PLAYERS = 1;

const CreateGame = (props) => {
    const {client, setRoom} = props;
    const [code, setCode] = useState('');
    const [players, setPlayers] = useState(MIN_PLAYERS);
    const [roles, setRoles] = useState(new Map());
    const [error, setError] = useState('');
    const [mafia, setMafia] = useState(1);
    const history = useHistory();

    const handleSubmit = () => {
        const roleArr = [...roles].map(([a, b]) => ({_id: a._id, qty:b})); // convert map to array
        client.create("mafia", {code: code.trim(), roles: roleArr, numPlayers: Number.parseInt(players), 
            numMafia : Number.parseInt(mafia), god: true})
        .then(r => {
            setRoom(r);
            history.push('/game');
        })
        .catch(err => {
            console.log(err.message);
            if (err && err.message) {
                setError(err.message);
            }
        });
    };

    const roleHandler = {
        addRole: (role) => {
            if (role && !roles.has(role)) {
                setRoles(new Map(roles.set(role, 1)));
            }
        },
        updateQuantity: (role, qty) => {
            if (role && qty) {
                setRoles(new Map(roles.set(role, qty)));
            }
        },
        deleteRole: (role) => {
            return () => {
                roles.delete(role)
                setRoles(new Map(roles[Symbol.iterator]()))
            };
        }
    }

    const generateOptions = () => {
        let options = [];
        for (let i = MIN_PLAYERS; i <= 20; ++i) {
            options.push(i);
        }
        return options.map(i => <option key={i}>{i}</option>);
    };

    return (
        <Container className="form">
            <Field>
                <Label>Room Code</Label>
                <Control>
                    <Input onChange={(e) => setCode(e.target.value)} value={code} type="text" placeholder="e.g. Group1" name="code" />
                </Control>
            </Field>
            <Field horizontal={true}>
                <Label>Players: &nbsp;</Label>
                <Field.Body>
                    <Control>
                        <Select onChange={(e) => setPlayers(e.target.value)} value={players} name="players">
                            {generateOptions()}
                        </Select>
                    </Control>
                </Field.Body>
            </Field>
            <Field>
                <Label>Setup</Label>
                <CreateSetup numPlayers={players} roles={roles} roleHandler={roleHandler} mafia={mafia} setMafia={setMafia}/>
            </Field>
            <Error error={error}/>
            <Level>
                <Level.Item align="center">
                    <Button color="success" onClick={handleSubmit}>Create!</Button>
                </Level.Item>
            </Level>

        </Container>
    );

}



export default CreateGame;
