import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { w3cwebsocket } from "websocket";

const ws = new w3cwebsocket(process.env.REACT_APP_WSERVER);

const Reading = ({ value, color, bold = false, ext = "" }) => {
    var color_ = "";

    if (color === "white") {
        color_ = "text-white";
    } else if (color === "red") {
        color_ = "text-red-600";
    } else if (color === "blue") {
        color_ = "text-blue-600";
    } else if (color === "green") {
        color_ = "text-green-600";
    }
    return (
        <div
            className={`w-full p-1 text-2xl ${color_} ${
                bold ? "font-bold" : ""
            } text-center`}
        >
            {value} {ext}
        </div>
    );
};

const MoveReading = ({ img_id, time }) => {
    return (
        <div className="flex w-full justify-center items-center p-2 m-2">
            <div className="flex w-1/3 text-white font-bold justify-center items-center text-3xl">
                {time.toLocaleString()}
            </div>
            <div className="flex w-1/3 text-red-600 font-bold uppercase text-center justify-center items-center text-3xl">
                MOVEMENT DETECTED
            </div>
            <div className="flex w-1/3 justify-center items-center aspect-video text-blue-600 font-bold uppercase text-center text-3xl hover:underline transition-all">
                <a
                    href={`${process.env.REACT_APP_SERVER}images/${img_id}`}
                    target={"_blank"}
                    rel={"noreferrer"}
                >
                    View Image
                </a>
            </div>
        </div>
    );
};

export default function DataLogger() {
    const [socketStatus, setSocketStatus] = useState(false);
    const [humidityList, setHumidityList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [moistList, setMoistList] = useState([]);
    const [moveList, setMoveList] = useState([]);
    const [lastMove, setLastMove] = useState({});

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
            } else if (data.datakind === "m") {
                var time = new Date();
                setMoveList([
                    ...moveList,
                    { idx: uid, read: 1, img_id: data.event_id, time: time },
                ]);
            }
        };
    }, [humidityList, moistList, tempList, socketStatus, moveList]);

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
            moist: Math.floor(sumMoist / 5),
        };
        if (newMeanValue !== meanValues) {
            setMeanValues(newMeanValue);
        }

        if (moveList.length > 0) {
            if (lastMove !== moveList[-1]) {
                setLastMove(moveList[-1]);
            }
        }
    }, [humidityList, moistList, tempList, moveList]);

    return (
        <>
            <div className="w-full border-white border-2 m-5 p-5">
                <div className="w-full flex justify-center items-center">
                    <h1 className="text-center text-2xl text-white font-bold uppercase">
                        SOCKET SERVER:{" "}
                        {socketStatus ? (
                            <span className="text-green-600">ONLINE</span>
                        ) : (
                            <span className="text-red-600">OFFLINE</span>
                        )}
                    </h1>
                </div>
            </div>

            <div className="w-full border-white border-2 m-5 p-5 flex justify-start flex-col h-screen">
                <div className="w-full container">
                    <h1 className="text-center text-3xl text-white font-bold uppercase">
                        LIVE READINGS
                    </h1>
                </div>
                <div className="divider"></div>
                <div className="flex justify-start items-start flex-row w-full h-full">
                    <div className="flex justify-start items-start m-1 p-1 w-1/3 flex-col h-5/6">
                        <Reading value={"HUMIDITY"} color={"red"} bold />
                        <div className="divider"></div>
                        <div className="container w-full flex-col h-5/6 overflow-x-hidden overflow-y-scroll ">
                            {humidityList.map((read) => (
                                <Reading
                                    key={read.idx}
                                    value={read.read}
                                    color={"red"}
                                    ext={"%"}
                                />
                            ))}
                        </div>
                        <div className="divider"></div>
                        <Reading
                            value={meanValues.humidity}
                            color={"red"}
                            bold
                            ext="%"
                        />
                    </div>
                    <div className="flex justify-start items-start m-1 p-1 w-1/3 flex-col h-5/6">
                        <Reading value={"TEMPERATURE"} color={"blue"} bold />
                        <div className="divider"></div>

                        <div className="container w-full flex-col h-5/6 overflow-x-hidden overflow-y-scroll">
                            {tempList.map((read) => (
                                <Reading
                                    key={read.idx}
                                    value={read.read}
                                    color={"blue"}
                                    ext={"*C"}
                                />
                            ))}
                        </div>
                        <div className="divider"></div>
                        <Reading
                            value={meanValues.temp}
                            color={"green"}
                            bold
                            ext="*C"
                        />
                    </div>
                    <div className="flex justify-start items-start m-1 p-1 w-1/3 flex-col h-5/6">
                        <Reading value={"MOISTURE"} color={"green"} bold />
                        <div className="divider"></div>

                        <div className="container w-full flex-col h-5/6 overflow-x-hidden overflow-y-scroll">
                            {moistList.map((read) => (
                                <Reading
                                    key={read.idx}
                                    value={read.read}
                                    color={"green"}
                                    ext={"%"}
                                />
                            ))}
                        </div>
                        <div className="divider"></div>
                        <Reading
                            value={meanValues.moist}
                            color={"green"}
                            bold
                            ext="%"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full border-white border-2 m-5 p-5 flex flex-col h-screen">
                <div className="w-full container">
                    <h1 className="text-center text-3xl text-white font-bold uppercase">
                        MOVEMENT TRACKERS
                    </h1>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col justify-start items-start w-full h-5/6 overflow-x-hidden overflow-y-auto">
                    {moveList.map((ev) => (
                        <MoveReading img_id={ev.img_id} time={ev.time} />
                    ))}
                </div>
                <div className="divider"></div>
            </div>
        </>
    );
}
