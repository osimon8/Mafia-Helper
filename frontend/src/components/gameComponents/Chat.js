import React, { useState } from 'react';
import { Container, Heading, Box, Button, Form } from 'react-bulma-components';

const {Field, Input, Control} = Form;


const Messages = (props) => {
    const {messages} = props;
    return (
    <Container style={{textAlign: 'left', height: '83%', overflowY: 'auto', fontSize: '.95em', lineHeight: '1.8'}}>        
    {messages.map((m, i) => {
        // return <div key ={i} style={{borderBottom:'1px solid lightgray'}}>
        return <div key ={i}>
                <p><strong>{m.sender}</strong>: {m.text}</p>
        </div>;
    })}
    </Container>);
};


const Chat = (props) => {
    const {room, addMessage, messages} = props;

    const MessageBox = () => {
        const [input, setInput] = useState('');

        const send = () => {
            const clean = input.trim();
            if (clean) {
                addMessage('You', clean);
                setInput('');
                room.send('message', clean);
            }
        }

        const enter = (e) => {
            if (e.key === 'Enter') {
                send();
            }
        }

        return <Field className={"has-addons"}>
            <Input onChange={(e) => setInput(e.target.value)} onKeyPress={enter} type="text" value={input} placeholder="Enter a message:"/>
            <Control> <Button color="info" onClick={send}>Send</Button></Control>
            </Field>;
    }

    return (
        <Container>
            <Box style={{height: '50vh'}}>
                <Heading>Chat</Heading>
                <Messages messages={messages}/>
                <MessageBox addMessage={addMessage}/>
            </Box>
        </Container>
    );
};



export default Chat;