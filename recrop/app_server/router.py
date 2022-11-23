import os
from io import BytesIO
from pathlib import Path

from base64 import b64encode

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse, Response

from recrop.app_server.deps import get_redis
from recrop.app_server.socket_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

static_dir = Path(os.getenv("CAMERA_OUT_DIR", "./output/"))


@router.post("/pump")
async def toggle_pump(state: int, redis=Depends(get_redis)):

    if state == 1:
        await redis.set("pump", "1")

    elif state == 0:
        await redis.set("pump", "0")


@router.websocket("/")
async def socket(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_json()

            if data["event"] == "feed":
                await manager.post(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.get("/images/{img_id}")
async def get_image(img_id: str):
    img_path = Path(static_dir.resolve(), f"{img_id}.png")

    if img_path.exists():
        encoded_data = b64encode(img_path.open("rb").read()).decode("utf-8")
        return {"b64": encoded_data}

    return None
