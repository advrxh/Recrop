from recrop.camera_watcher.cv_cap import capture


class CapTrigMonitor:

    def __init__(self, redis) -> None:
        self.redis = redis

    def monitor(self):
        while True:
            cap = self.redis.get("cap")

            if cap is not None and cap.decode() != "none":
                capture(cap.decode("utf-8"), self.redis)
