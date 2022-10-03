import React, { useState, useEffect } from "react";

import axios from "axios";

import "../styles/PumpControl.css";

export default function PumpControl() {
    const [checked, setChecked] = useState(false);
    console.log();
    useEffect(() => {
        async function togglePump(state) {
            await axios.post(
                process.env.REACT_APP_SERVER + `pump?state=${state}`
            );
        }
        if (checked) {
            togglePump(1);
        } else {
            togglePump(0);
        }
    }, [checked]);

    return (
        <div className="container flex-col p-5">
            <input
                type="checkbox"
                className="toggle m-4 toggle-lg"
                checked={checked}
                onChange={() => setChecked(!checked)}
            />
            <h1 className="text-4xl font-bold text-white drop-shadow-xl">
                PUMP:{" "}
                {!checked ? (
                    <span className="text-red-600">OFF</span>
                ) : (
                    <span className="text-green-600">ON</span>
                )}
            </h1>
        </div>
    );
}
