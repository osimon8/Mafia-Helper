import React, { useEffect, useState } from 'react';
import { Container, Heading, Box, Button, Loader, Section } from 'react-bulma-components';

const EventLog = (props) => {
    const {events} = props;

    return (
        <Container>
            <Box>
                <Heading>Events</Heading>
            </Box>
        </Container>
    );
};



export default EventLog;