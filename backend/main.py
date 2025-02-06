from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from typing import List

app = FastAPI()


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
        
app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static")