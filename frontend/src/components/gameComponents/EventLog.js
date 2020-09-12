import React from 'react';
import { Container, Heading, Box } from 'react-bulma-components';

const EventLog = (props) => {
    const {events} = props;

    const Messages = () => {
        return (
        <Container style={{textAlign: 'left', maxHeight: '90%', overflowY: 'auto', fontSize: '.95em', lineHeight: '1.8'}}>        
        {events.map((e, i) => {
            return <div key ={i} style={{borderBottom:'1px solid lightgray'}}>
                    <p>{e.text}</p>
            </div>;
        })}
        </Container>);
    };

    return (
        <Container>
            <Box style={{height: '50vh'}}>
                <Heading>History</Heading>
                <Messages/>
            </Box>
        </Container>
    );
};



export default EventLog;