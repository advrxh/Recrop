import { useEffect } from "react";
import PumpControl from "./components/PumpControl";
import "./styles/App.css";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import DataLogger from "./components/DataLogger";

function App() {
    return (
        <div id="home">
            <div className="container">
                <PumpControl />
            </div>
            <div className="container w-full flex-col p-5">
                <DataLogger />
            </div>
        </div>
    );
}

export default App;
