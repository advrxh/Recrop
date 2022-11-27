import os

import redis

from recrop.camera_watcher.cap_trig_monitor import CapTrigMonitor

REDIS_HOST = os.getenv("REDIS_HOST", 'localhost')
REDIS_PASS = os.getenv("REDIS_PASS", '')
REDIS_PORT = os.getenv("REDIS_PORT", 6379)

redis = redis.Redis(host=REDIS_HOST, password=REDIS_PASS, port=REDIS_PORT)

CapTrigMonitor(redis).monitor()

