import time

import redis
import serial


class SerialCom:
    def __init__(self, port: str = "COM3"):

        self.port = port
        self.com = serial.Serial(self.port, 9600)
        self.redis = redis.Redis(port=6379)

    def start_dog(self):

        while True:
            time.sleep(0.5)

            read = self.com.readline().decode("ascii")
            
            if self.redis.get("pump").decode('utf-8') == "1":
                self.com.write("P:1".encode())
            
            if self.redis.get("pump").decode("utf-8") == "0":
                self.com.write("P:0".encode())

            if len(read) > 0:
                if read.startswith("MS:"):
                    print(f"Read MOISTURE: {read[2:]}")

            if read.startswith("T:"):
                print(f"Read TEMPERATURE: {read[1:]}")

            if read.startswith("H:"):
                print(f"Read HUMIDITY: {read[1:]}")

            if read.startswith("M:"):
                print(f"MOVEMENT Detected")


if __name__ == "__main__":
    com = SerialCom()

    com.start_dog()
