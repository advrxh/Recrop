import React, { useState, useEffect } from "react";

import axios from "axios";

import "../styles/PumpControl.css";

export default function PumpControl() {
    const [checked, setChecked] = useState(false);
    console.log();
    useEffect(() => {
        async function togglePump(state) {
            await axios.post(
                `http://${window.location.hostname}:8000/pump?state=${state}`
            );
        }

        if (checked) {
            togglePump(1);
        } else {
            togglePump(0);
        }
    }, [checked]);

    return (
        <>
            <h1 className="text-2xl sm:text-4xl font-bold text-secondary drop-shadow-xl my-4 p-6 border-2 border-primary bg-bg rounded-xl cursor-pointer">
                PUMP:{" "}
                {!checked ? (
                    <span className="text-red-400">OFF</span>
                ) : (
                    <span className="text-primary">ON</span>
                )}
            </h1>

            <input
                type="checkbox"
                className={`toggle m-4 toggle-lg ${
                    checked ? "bg-primary" : "bg-red-400"
                }`}
                checked={checked}
                onChange={() => setChecked(!checked)}
            />
        </>
    );
}
