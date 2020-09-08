import React from 'react';
import {Container} from 'react-bulma-components';


 const Error = (props) => (
    <Container style={{'textAlign': 'center', 'color': 'red', 'marginBottom': '10px'}}>
        {props.error}
    </Container>
);

export default Error;