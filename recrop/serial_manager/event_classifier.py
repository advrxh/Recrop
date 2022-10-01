from uuid import uuid4

from recrop.serial_manager.socket_feeder import Feeder


class Classifier:

    def __init__(self, serial_read:str, ws_conn, redis):

       self.serial_read = serial_read 
       self.datakind = ""
       self.event_id = ""
       self.feeder = Feeder(ws_conn)
       self.redis = redis

       self._classify()

    def _classify(self):
        if self.serial_read.startswith("MS:"):
           self.datakind = "ms" 
        
        elif self.serial_read.startswith("T:"):
            self.datakind = "t"

        elif self.serial_read.startswith("H:"):
            self.datakind = "h"

        elif self.serial_read.startswith("M:"):
            self.datakind = "m"
            self.event_id = str(uuid4())
            self.redis.set("cap", self.event_id)

        else:
            self.datakind = None

    def feed(self):

        if self.datakind is not None:
            self.feeder.feed(self.datakind, self.serial_read, self.event_id)

    