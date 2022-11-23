import React, { useEffect, useState } from "react";

import "../styles/MeanDisplay.css";
import Humidity from "../svg/humidity";
import Moisture from "../svg/moisture";
import Thermometer from "../svg/thermometer";

import { v4 as uuid } from "uuid";

import { w3cwebsocket } from "websocket";

const ws = new w3cwebsocket(process.env.REACT_APP_WSERVER);

const DataSection = ({ icon, heading, unit, reading }) => {
    return (
        <div className="data-section">
            <div className="data-image">{icon}</div>
            <div className="data-heading">
                <h1>{heading}</h1>
            </div>
            <div className="mean-magnitude">
                <p>
                    {reading}
                    <span className="unit">{unit}</span>
                </p>
            </div>
        </div>
    );
};

export default function MeanDisplay() {
    const [socketStatus, setSocketStatus] = useState(false);
    const [humidityList, setHumidityList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [moistList, setMoistList] = useState([]);

    const [meanValues, setMeanValues] = useState({
        humidity: 0,
        temp: 0,
        moist: 0,
    });

    useEffect(() => {
        ws.onopen = () => setSocketStatus(true);
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            var uid = uuid().toString().substring(0, 4);

            if (data.datakind === "h") {
                setHumidityList([
                    ...humidityList,
                    { idx: uid, read: data.read },
                ]);
            } else if (data.datakind === "t") {
                setTempList([...tempList, { idx: uid, read: data.read }]);
            } else if (data.datakind === "ms") {
                setMoistList([...moistList, { idx: uid, read: data.read }]);
            }
        };
    }, [humidityList, moistList, tempList, socketStatus]);

    useEffect(() => {
        var sumHumidity = 0;
        var sumTemp = 0;
        var sumMoist = 0;

        const st_idx = humidityList.length - 6;
        const en_idx = humidityList.length - 1;
        if (humidityList.length > 5) {
            humidityList
                .slice(st_idx, en_idx)
                .map((read) => (sumHumidity += parseFloat(read.read)));
            tempList
                .slice(st_idx, en_idx)
                .map((read) => (sumTemp += parseFloat(read.read)));
            moistList
                .slice(st_idx, en_idx)
                .map((read) => (sumMoist += parseFloat(read.read)));
        }

        var newMeanValue = {
            humidity: Math.floor(sumHumidity / 5),
            temp: Math.floor(sumTemp / 5),
            moist: (sumMoist / 5).toFixed(3),
        };
        if (newMeanValue !== meanValues) {
            setMeanValues(newMeanValue);
        }
    }, [humidityList, moistList, tempList]);

    return (
        <>
            <DataSection
                icon={<Thermometer />}
                heading={"Temperature"}
                unit={"°C"}
                reading={meanValues.temp}
            />
            <DataSection
                icon={<Humidity />}
                heading={"Humidity"}
                unit={"%"}
                reading={meanValues.humidity}
            />
            <DataSection
                icon={<Moisture />}
                heading={"Moisture"}
                unit={"%"}
                reading={meanValues.moist}
            />
        </>
    );
}
