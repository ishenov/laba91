<<<<<<< HEAD
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
=======
import React, {Component, Fragment} from 'react';
import Toolbar from "./components/UI/Toolbar/Toolbar";
import {Container} from "reactstrap";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <Fragment>
        <header>
          <Toolbar/>
        </header>
        <Container style={{marginTop: '20px'}}>
          <Routes/>
        </Container>
      </Fragment>
    );
  }
}
>>>>>>> 39c882c44f81eca4e688810176efeda95844bce4

export default App;