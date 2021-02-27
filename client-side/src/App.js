import React, {useEffect, useState} from 'react';
import './App.css';
import {w3cwebsocket as w3cWebSocket} from 'websocket';

const webSocketClient = new w3cWebSocket('ws://localhost:8080/');

webSocketClient.onerror = function() {
  console.log('Connection Error');
};

webSocketClient.onopen = function() {
  console.log('WebSocket webSocketClient Connected');
};

webSocketClient.onclose = function() {
  console.log('echo-protocol webSocketClient Closed');
};

function App() {
  const [text, setText] = useState("");

  function updateTextEvent(e) {
    if (webSocketClient.readyState === webSocketClient.OPEN) {
        console.log(e);
        webSocketClient.send(JSON.stringify({
          type: "UPDATE_EDITOR",
          text: e.target.value
        }));
    }
    setText(e.target.value);
  }

  useEffect(() => {
    console.log(webSocketClient)
    webSocketClient.onmessage = function(message) {
      const dataFromServer = JSON.parse(message.data);
      console.log(dataFromServer);
      switch(dataFromServer.type) {
        case "UPDATE_EDITOR":
          setText(dataFromServer.text);
          break;
        case "USER_EVENT":
          break;
        default:
          console.log('unhandled event');
      }
    };
  }, []);

  return (
    <div className="App">
      <textarea
        onChange={updateTextEvent}
        value={text}
        rows={10}
        style={{
          position: 'absolute',
          width: '50%',
          outline: 'none',
          left: 0,
        }}
      />
    </div>
  );
}

export default App;
