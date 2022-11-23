import PumpControl from "./components/PumpControl";
import "./styles/App.css";

import MeanDisplay from "./components/MeanDisplay";
import LastMotion from "./components/LastMotion";

function App() {
    return (
        <div id="home">
            <h1 id="heading">RECROP - SMART YIELD ASSIST</h1>
            <div className="pump-control">
                <PumpControl />
            </div>
            <div className="mean-display">
                <MeanDisplay />
            </div>
            <div className="last-motion">
                <LastMotion />
            </div>
        </div>
    );
}

export default App;
