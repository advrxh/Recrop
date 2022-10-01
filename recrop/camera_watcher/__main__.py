import os

import redis

from recrop.camera_watcher.cap_trig_monitor import CapTrigMonitor

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

redis = redis.Redis(host=REDIS_HOST, port=6379)

CapTrigMonitor(redis).monitor()

