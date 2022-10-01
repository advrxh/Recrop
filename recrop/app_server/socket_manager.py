from typing import List

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def post(self, data):
        if data.get("event_id") is None:
            post_data = {
                "event": "post",
                "datakind" : data["datakind"],
                "read": data["read"]
            }

        else: 

            post_data = {
                "event": "post",
                "datakind" : data["datakind"],
                "read": "1",
                "event_id": data["event_id"]
            }

        for connection in self.active_connections:
           await connection.send_json(post_data)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)