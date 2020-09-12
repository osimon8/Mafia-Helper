import React, { useState, useEffect } from 'react';
import { Heading, Container, Level, Form, Box, Modal, Button, Dropdown } from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { CreateRole, Alignment } from '../components';
import axios from 'axios';

const { Label, Field, Control, Select } = Form;

const CreateCard = () => {

    const [show, setShow] = useState(false);

    const open = () => setShow(true);
    const close = () => setShow(false);

    return (
        <div>
            <div style={{ 'minWidth': '40%', 'textAlign': 'center', 'cursor': 'pointer' }} onClick={open}>
                <Box>
                    Create new role...
            </Box>
            </div>
            <Modal show={show} onClose={close} closeOnBlur={true}>
                <Modal.Content>
                    <Box style={{ textAlign: 'center' }}>
                        <CreateRole close={close} />
                    </Box>
                </Modal.Content>
            </Modal></div>
    );
};

const CreateSetup = (props) => {
    const { roles, mafia, setMafia} = props;
    const {addRole, deleteRole, updateQuantity} = props.roleHandler;

    const [roleData, setRoleData] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        axios.get('http://localhost:9000/getRoles').then((res) => {
            setRoleData(res.data);
        });
    }, []);

    const mafiaOptions = (numPlayers) => {
        let options = [];
        for (let i = 1; i <= numPlayers; ++i) {
            options.push(i);
        }
        return options.map(i => <option key={i}>{i}</option>);
    }

    const playerOptions = (numPlayers) => {
        let options = [];
        for (let i = 1; i <= numPlayers; ++i) {
            options.push(i);
        }
        return options.map(i => <Dropdown.Item key={i} value={i}>{i}</Dropdown.Item>);
    }

    const AddCard = (params) => {
        return (
            <div style={{ 'maxWidth': '35%', 'textAlign': 'center' }}>
                <Box>
                    <Field>
                        <strong>Add Role</strong>  &nbsp;
                    <Dropdown value={role} onChange={v => setRole(v)} label="Select..">
                            {roleData.map((role, i) => <Dropdown.Item key={i} value={role}>{role.name}</Dropdown.Item>)}
                        </Dropdown> &nbsp;
                    <Button onClick={() => addRole(role)}>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </Button>
                    </Field>
                </Box>
            </div>
        );
    }

    const RoleCard = (params) => {
        return (
            <div style={{ 'maxWidth': '40%', 'textAlign': 'center' }}>
                <Box>
                    <Level style={{ 'marginBottom': '0' }}>
                        <span></span>
                        <FontAwesomeIcon icon={faTrash} style={{ 'cursor': 'pointer' }} onClick={deleteRole(params.role)}></FontAwesomeIcon>
                    </Level>
                    <Heading size={5}>
                        {params.role.name}
                    </Heading>
                    <Heading subtitle size={5}>
                        Alignment: <Alignment alignment={params.role.alignment}/>
                    </Heading>
                    <Heading subtitle size={6}>
                        {params.role.description}
                    </Heading>
                    <strong>Amount &nbsp; </strong>
                    <Dropdown value={roles.get(params.role)} onChange={v => updateQuantity(params.role, v)}>
                        {playerOptions(props.numPlayers)}
                    </Dropdown>
                </Box>
            </div>
        );
    }

    return (
        <Container className="form">
            <Field horizontal={true}>
                <Label>Mafia: &nbsp;</Label>
                <Field.Body>
                    <Control>
                        <Select onChange={(e) => setMafia(e.target.value)} value={mafia} name="numMafia">
                            {mafiaOptions(props.numPlayers)}
                        </Select>
                    </Control>
                </Field.Body>
            </Field>
            {[...roles.keys()].map((r, i) => <RoleCard key={i} role={r} />)}
            <AddCard />
            <CreateCard />
        </Container>
    );

}



export default CreateSetup;
