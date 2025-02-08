import React, {useState, useEffect, useRef} from 'react';
import io, { Socket } from 'socket.io-client';

const Chat : React.FC = () => {
    const [message,setMessage] = useState<string[]>([]);
    const [input,setInput] = useState<string>('');
    const socketRef = useRef<Socket | null>(null);

useEffect(() => {
    socketRef.current = io('ws://localhost:8000');


socketRef.current.on('message',(message:string)=>{
    setMessage((prevMessages) => [...prevMessages,message]);
});

return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };
}, []);

const sendMessage = () => {
  if (socketRef.current && input.trim()) {
    socketRef.current.emit('message', input);  
    setInput('');  
  }
};

return (
  <div>
    <div>
      {message.map((msg, index) => (
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
