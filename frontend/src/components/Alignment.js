import React from 'react';

const map = {
    Town : '#3bde3b',
    Mafia: 'red',
    Cult: 'gray',
    Fool: 'pink'
};

const std = 'black';

const Alignment = (props) => {
    const {alignment} = props;
    return <strong style={{color: map[alignment] || std}}>{alignment}</strong>
} 


export default Alignment;