
import os

import aioredis
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse

from recrop.app_server.router import router

REDIS_HOST = os.getenv("REDIS_HOST", 'localhost')
REDIS_PASS = os.getenv("REDIS_PASS", '')
REDIS_PORT = os.getenv("REDIS_PORT", 6379)


def create_app(redis=None):
    """
    redis: Redis instance / coroutine
    """

    app = FastAPI()

    origins = [
    "*"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(router)

    @app.on_event('startup')
    async def startup():
        nonlocal redis

        if redis is None:
            # if redis is None, create the instance on start up
            redis = await aioredis.Redis(host=REDIS_HOST, password=REDIS_PASS, port=REDIS_PORT)
        assert await redis.ping()

    @app.middleware('http')
    async def http_middleware(request: Request, call_next):
        nonlocal redis

        # Initial response when exception raised on 
        #  `call_next` function
        err = {'error': True, 'message': "Internal server error"},
        response = JSONResponse(err, status_code=500)
        
        try:
            request.state.redis = redis
            response = await call_next(request)
        finally:
            return response

    return app 



app = create_app()