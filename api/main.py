from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime
import json

from typing import List

app = FastAPI()

#Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

active_connections: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept() 
    active_connections.append(websocket) 
    try:
        while True:
            data = await websocket.receive_text() 
            message = {
                "text" : data,
                "sending_time":datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
            }

            for connection in active_connections:
                await connection.send_text(json.dumps(message))
                
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        active_connections.remove(websocket) 