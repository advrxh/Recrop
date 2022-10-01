from simple_websocket_server import WebSocket, WebSocketServer


class SimpleEcho(WebSocket):
    def handle(self):
        # echo message back to client
        print(self.data)

    def connected(self):
        print(self.address, 'connected')

    def handle_close(self):
        print(self.address, 'closed')


server = WebSocketServer('', 8001, SimpleEcho)
server.serve_forever()