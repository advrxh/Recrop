import os
import time

import redis
import serial
import websocket

from recrop.serial_manager.event_classifier import Classifier
from recrop.serial_manager.pump_toggle import toggle_pump_state


REDIS_HOST = os.getenv("REDIS_HOST", 'localhost')
REDIS_PASS = os.getenv("REDIS_PASS", '')
REDIS_PORT = os.getenv("REDIS_PORT", 6379)

class Manager():

    def __init__(self, port: str = "COM3") -> None:
        self.port = port
        self.serial_com = serial.Serial(self.port, 9600)
        
        self.server_host = os.getenv("WEBSOCKET_SERVER", "ws://echo.websocket.events")

        self.server = websocket.WebSocket()
        self.redis = redis.Redis(host=REDIS_HOST, password=REDIS_PASS, port=REDIS_PORT)

    def exec_loop(self):

        self.server.connect(self.server_host)

        last_pumped = False

        while True:

            time.sleep(.5)

            if toggle_pump_state(self.redis):
                self.serial_com.write("P:1".encode())
                last_pumped = True
            elif not toggle_pump_state(self.redis) and last_pumped:
                self.serial_com.write("P:0".encode())
                last_pumped = False

            serial_read = self.serial_com.readline().decode("ascii")

            classifier = Classifier(serial_read=serial_read, ws_conn=self.server, redis=self.redis)

            classifier.feed()



