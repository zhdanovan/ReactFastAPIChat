import React, { useState, useEffect, useRef } from 'react';
import Notification from './Notification';

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
    <div>
      <div>
        {messages.map((msg, index) => (
           <div key={index} style={{ marginBottom: '8px' }}>
           <strong>{msg.text}</strong> - <span style={{ color: 'gray' }}>{msg.sending_time}</span>
         </div>
        ))}
      </div>
      <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
    {notificationMessage && <Notification message={notificationMessage} duration={3000} />}
  </div>
);
};

export default Chat;