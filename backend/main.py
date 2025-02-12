from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import List

app = FastAPI()

#Модель для пользователя 
class User(BaseModel):
    id:str
    username:str
    password_hash:str

#Модель для пользователя 
class UserRegsiter(BaseModel):
    id:str
    username:str


#Модель для пользователя 
class UserLogin(BaseModel):
    id:str
    username:str
   
#Модель для пользователя 
class Token(BaseModel):
    token:str
    token_type:str

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
            for connection in active_connections:
                await connection.send_text(f"Сообщение: {data}")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        active_connections.remove(websocket) 