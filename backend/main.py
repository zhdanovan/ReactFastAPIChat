from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from typing import List, Optional
import uuid
import datetime


from typing import List

app = FastAPI()


SECRET_KEY = ""  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ShortUser(BaseModel):
    id:str
    username:str

class FullUser(ShortUser):
    password_hash:str

class UserRegsiter(BaseModel):
    id:str
    username:str

class UserLogin(BaseModel):
    id:str
    username:str
   
class Token(BaseModel):
    token:str
    token_type:str

users_db: dict = {}

def create_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user(username: str) -> Optional[FullUser]:
    if username in users_db:
        user_dict = users_db[username]
        return FullUser(**user_dict)
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