from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

from typing import List

app = FastAPI()


SECRET_KEY = ""  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


users_db: dict = {}

def get_user(username: str):
    if username in users_db:
        user_dict = users_db[username]
        return User(**user_dict)
    return None



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