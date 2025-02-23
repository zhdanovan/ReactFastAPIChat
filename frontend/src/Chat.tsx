import React, { useState, useEffect, useRef } from 'react';
import Notification from './Notification';
import './styles.css';

interface Message{
  text:string;
  sending_time:string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);  
  const [input, setInput] = useState<string>('');  
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);  

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const message : Message = {text : data.text, sending_time:data.sending_time};
      setMessages((prevMessage)=>[...prevMessage,message]);
      setNotificationMessage(`Новое сообщение: ${data.text}`);
    };

    socketRef.current = socket

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(input);  
      setInput('');  
      setNotificationMessage('Сообщение отправлено');
    }
  };

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      height: '100vh', 
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: '400px', 
        height: '300px',
        backgroundColor: '#f9f9f9',
        borderRadius: '15px', 
        overflowY: 'auto', 
        border: '1px solid #ddd',
        marginBottom: '20px',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className="message"
          style={{
            marginBottom: '8px',
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: '#005F5F', 
            color: 'white',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        >
          <strong>{msg.text}</strong> -{' '}
          <span style={{ color: '#fff', fontSize: '0.8em' }}>{msg.sending_time}</span>
        </div>
      ))}
    </div>
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '400px', 
        alignItems: 'center',
        gap: '10px', 
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите сообщение..."
        style={{
          flex: 1, 
          padding: '10px',
          borderRadius: '20px', 
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '1rem',
        }}
      />
      <button
        onClick={sendMessage}
        className = "sending-button"
        style={{
          padding: '10px 20px',
          borderRadius: '20px', 
          backgroundColor: '#005F5F',
          color: '#fff',
          border: 'none',
          outline:'none',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.3s ease',
        }}
      >
        Отправить
      </button>
    </div>
    {notificationMessage && <Notification message={notificationMessage} duration={3000} />}
  </div>
);
};

export default Chat;