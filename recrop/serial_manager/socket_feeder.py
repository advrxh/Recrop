import json


class Feeder:

    def __init__(self, ws) -> None:
        
        self.payload = {
            "event" : "feed",
            "datakind" : "",
            "read": ""
        }

        self.ws = ws

    def feed(self, datakind:str, serial_read:str, event_id:str=None):
        
        if datakind != "m":
            self.payload["datakind"] = datakind
            self.payload["read"] = serial_read.split(':')[-1].rstrip()

            self.ws.send(json.dumps(self.payload))
            return
        
        self.payload["datakind"] = "m"
        self.payload["read"] = "1"
        self.payload["event_id"] = event_id
        self.ws.send(json.dumps(self.payload))


