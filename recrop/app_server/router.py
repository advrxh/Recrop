import os
from pathlib import Path

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse

from recrop.app_server.deps import get_redis
from recrop.app_server.socket_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

static_dir = Path(os.getenv("CAMERA_OUT_DIR", "./output/"))

@router.post("/pump")
async def toggle_pump(state:int, redis=Depends(get_redis)):

    if state == 1:
        await redis.set("pump", "1")

    elif state == 0:
        await redis.set("pump", "0")

@router.websocket("/")
async def socket(websocket:WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_json()

            if data["event"] == "feed":
                await manager.post(data)
    except WebSocketDisconnect:
        pass


@router.get("/images/{img_id}")
async def get_image(img_id:str):
    img_path = Path(static_dir.resolve(), f"{img_id}.png")

    if img_path.exists():
        return FileResponse(img_path.resolve())

    return None