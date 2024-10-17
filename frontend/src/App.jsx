import React, { useEffect, useState } from 'react';


function App() {
  const [messagesUser1, setMessagesUser1] = useState([]);
  const [messagesUser2, setMessagesUser2] = useState([]);
  const [inputUser1, setInputUser1] = useState('');
  const [inputUser2, setInputUser2] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.user === 'User1') {
        setMessagesUser2((prev) => [...prev, data]); // Show User1's message on User2's screen
      } else if (data.user === 'User2') {
        setMessagesUser1((prev) => [...prev, data]); // Show User2's message on User1's screen
      }
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
        {/* User1's Chat Panel */}
        <div className="col-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h5>User 1</h5>
            </div>
            <div className="card-body overflow-auto" style={{ height: '500px' }}>
              {messagesUser1.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.user}: </strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={inputUser1}
                onChange={(e) => setInputUser1(e.target.value)}
                placeholder="Type your message"
              />
              <button
                className="btn btn-primary"
                onClick={() => sendMessage('User1', inputUser1, setInputUser1)}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* User2's Chat Panel */}
        <div className="col-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white text-center">
              <h5>User 2</h5>
            </div>
            <div className="card-body overflow-auto" style={{ height: '500px' }}>
              {messagesUser2.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.user}: </strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={inputUser2}
                onChange={(e) => setInputUser2(e.target.value)}
                placeholder="Type your message"
              />
              <button
                className="btn btn-success"
                onClick={() => sendMessage('User2', inputUser2, setInputUser2)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
