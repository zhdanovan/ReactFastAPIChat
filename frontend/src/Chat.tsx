import React, { useState, useEffect, useRef } from 'react';

interface Message{
  text:string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);  
  const [input, setInput] = useState<string>('');  
  const socketRef = useRef<WebSocket | null>(null);  

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');
    socket.onmessage = (event) => {
      const message : Message = {text : event.data};
      setMessages((prevMessage)=>[...prevMessage,message]);
    };

    socketRef.current = socket

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
          <div key={index}>{msg.text}</div>
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