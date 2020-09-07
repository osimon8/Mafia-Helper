import React from 'react';
import { Button, Container, Level, Form, Heading } from 'react-bulma-components';
import axios from 'axios';

const { Label, Input, Field, Control, Checkbox } = Form;

class CreateRole extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: '', description: '', hasNightAction: false, nightAction: {}, deathAction: null};
        this.handleChange = this.handleChange.bind(this);
        this.handleNightChange = this.handleNightChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [event.target.name]: value });
    }

    handleNightChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ nightAction: {...this.state.nightAction, [event.target.name]: value} });
    }

    handleSubmit() {
        //console.log(event);
        // alert('A name was submitted: ' + this.state.value);
        // event.preventDefault();
        const params = {
            ...this.state,
            nightAction: this.state.hasNightAction ? this.state.nightAction : null
        }
        axios.post('http://localhost:9000/createRole', this.state).then((res) => {
            console.log(res);
        });
    }


    render() {
        return (
                <Container className="form">
                    <Heading style={{'textAlign': 'center'}}>Create a Role</Heading>
                    <Field>
                        <Label>Name</Label>
                        <Control>
                            <Input onChange={this.handleChange} value={this.state.name} type="text" placeholder="e.g. Cop" name="name" />
                        </Control>
                    </Field>
                    <Field>
                        <Label>Description</Label>
                        <Control>
                            <Input onChange={this.handleChange} value={this.state.description} type="text" placeholder="Enter a description for the role" name="description" />
                        </Control>
                    </Field>
                    <Field>
                        <Control>
                            <Label>Night Action?
                                <Checkbox onChange={this.handleChange} checked={this.state.hasNightAction} style={{'marginLeft': '5px'}} name="hasNightAction"></Checkbox>
                            </Label>
                        </Control>
                    </Field>
                    {this.state.hasNightAction ? 
                    <Container>
                    <Field invisible={!this.state.hasNightAction}>
                        <Control>
                            <Label>Description</Label>
                            <Input onChange={this.handleNightChange} value={this.state.nightAction.description} type="text" placeholder="Enter a description for the action" name="description"/>
                        </Control>
                    </Field>
                    <Field invisible={!this.state.hasNightAction}>
                        <Control>
                            <Label>Use Limit?</Label>
                            <Checkbox onChange={this.handleNightChange} checked={this.state.nightAction.hasUseLimit || false} name="hasNightAction" name="hasUseLimit"></Checkbox>
                        </Control>
                    </Field></Container> : null}
                    <Level>
                        <Level.Item align="center">
                            <Button color="success" onClick={this.handleSubmit}>Create!</Button>
                        </Level.Item>
                    </Level>

                </Container>
        );
    }
}



export default CreateRole;
