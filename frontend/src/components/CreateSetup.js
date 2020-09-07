import React, {useState, useEffect} from 'react';
import { Heading, Container, Level, Form, Box, Modal, Button, Dropdown } from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import {CreateRole} from '../components';
import axios from 'axios';

const { Label, Input, Field, Control, Checkbox, Select } = Form;

class CreateCard extends React.Component {

    state = {
        show: false,
    }

    open = () => this.setState({ show: true });
    close = () => this.setState({ show: false });

    render() {
        return (
            <div>
                <div style={{ 'minWidth': '40%', 'textAlign': 'center', 'cursor': 'pointer' }} onClick={this.open}>
                <Box>
                    Create new role...
            </Box>
                </div>
                <Modal show={this.state.show} onClose={this.close} closeOnBlur={true}>
                    <Modal.Content>
                        <Box style={{ textAlign: 'center' }}>
                        <CreateRole/>
                        </Box>
                    </Modal.Content>
                </Modal></div>
        );
    }
};


const CreateSetup = (props) => {

    const [numMafia, setNumMafia] = useState(0);
    const [roles, setRoles] = useState([]);
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


    const addRole = () => {
        if (role && !roles.some(r => r.name === role.name)) {
            setRoles([...roles, role]);
        }
    }

    const deleteRole = (name) => {
        return () => setRoles(roles.filter(r => r.name !== name));
    }

    const AddCard = (params) => {
        return (
            <div style={{ 'maxWidth': '35%', 'textAlign': 'center'}}>
                <Box>
                    <Field>
                    <strong>Add Role</strong>  &nbsp;
                    <Dropdown value={role} onChange={v => setRole(v)} label="Select..">
                            {roleData.map((role, i) => <Dropdown.Item key={i} value={role}>{role.name}</Dropdown.Item>)}
                    </Dropdown> &nbsp; 
                    <Button onClick={addRole}>
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
                        <FontAwesomeIcon icon={faTrash} style={{ 'cursor': 'pointer' }} onClick={deleteRole(params.role.name)}></FontAwesomeIcon>
                    </Level>
                    <Heading size={5}>
                        {params.role.name}
                    </Heading>

                    <Heading subtitle size={6}>
                        {params.role.description}
                    </Heading>
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
                            <Select onChange={(e) => setNumMafia(e.target.value)} value={numMafia} name="numMafia">
                                {mafiaOptions(props.numPlayers)}
                            </Select>
                        </Control>
                    </Field.Body>
                </Field>
                {roles.map((r, i) => <RoleCard key={i} role={r}/>)}
                <AddCard/>
                <CreateCard/>
            </Container>
        );
    
}



export default CreateSetup;
