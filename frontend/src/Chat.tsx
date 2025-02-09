import React, { useState, useEffect, useRef } from 'react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);  
  const [input, setInput] = useState<string>('');  
  const socketRef = useRef<WebSocket | null>(null);  

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8000/ws');

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(input);  
      setInput('');  
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};

export default Chat;