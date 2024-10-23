import { useEffect, useState } from 'react';

const ChatPanel = ({ user, input, setInput, messages, sendMessage }) => {
  const renderMessage = (msg, isCurrentUser) => {
    const alignment = isCurrentUser ? 'text-end' : 'text-start';
    const bubbleAlignment = isCurrentUser ? 'ms-auto' : 'me-auto';

    return (
      <div key={msg.id} className={`d-flex ${alignment} mb-2`}>
        <div className={`p-2 rounded border ${bubbleAlignment}`} style={{ maxWidth: '100%' }}>
          {msg.message}
        </div>
      </div>
    );
  };

  return (
    <div className="card shadow-sm">
      <div className={`card-header ${user === 'User1' ? 'bg-primary' : 'bg-success'} text-white text-center`}>
        <h5>{user}</h5>
      </div>
      <div className="card-body overflow-auto" style={{ height: '500px' }}>
        {messages.map((msg) => renderMessage(msg, msg.user === user))}
      </div>
      <div className="card-footer d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button
          className={`btn ${user === 'User1' ? 'btn-primary' : 'btn-success'}`}
          onClick={() => sendMessage(user, input, setInput)}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputUser1, setInputUser1] = useState('');
  const [inputUser2, setInputUser2] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = (user, input, setInput) => {
    if (input && socket) {
      socket.send(JSON.stringify({ message: input, user }));
      setInput(''); // Clear input after sending
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100" style={{ maxWidth: '800px' }}>
        <div className="col-6">
          <ChatPanel
            user="User1"
            input={inputUser1}
            setInput={setInputUser1}
            messages={messages}
            sendMessage={sendMessage}
          />
        </div>
        <div className="col-6">
          <ChatPanel
            user="User2"
            input={inputUser2}
            setInput={setInputUser2}
            messages={messages}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
