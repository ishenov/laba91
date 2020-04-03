import React, {useEffect, useRef, useState} from 'react';

const App = () => {
    const [form, setForm] = useState({text: ''});
    const [messages, setMessages] = useState([]);
    let ws = useRef({});
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/messenger');
        ws.current.onmessage = message => {
            try {
                const data = JSON.parse(message.data);
                switch (data.type) {
                    case 'RECEIVE_MESSAGE':
                        const receivedMessage = {
                            text: data.text,
                        };
                        setMessages(mgs => [...mgs, receivedMessage]);
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);
    const sendMessage = (e) => {
        e.preventDefault();
        ws.current.send(JSON.stringify({type: 'SEND_MESSAGE', text: form.text}))
    };
    console.log(messages);
    return (
        <div className="App">
            checking
            <form onSubmit={sendMessage}>
                <input type="text" value={form.text} onChange={(e) => (setForm({text: e.target.value}))}/>
                <button type='submit'> Submit message </button>
            </form>

            <div>
                {messages.map((m, id) => (
                    <div key={id}>
                        <b>{m.text}</b>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
