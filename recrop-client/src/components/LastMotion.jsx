import axios from "axios";
import React, { useEffect, useState } from "react";

import { v4 as uuid } from "uuid";
import { w3cwebsocket } from "websocket";

import "../styles/LastMotion.css";
const ws = new w3cwebsocket(process.env.REACT_APP_WSERVER);

export default function LastMotion() {
    const [socketStatus, setSocketStatus] = useState(false);
    const [moveList, setMoveList] = useState([]);
    const [lastMove, setLastMove] = useState({});
    const [b64Image, setB64Image] = useState("");

    useEffect(() => {
        var timeout;
        ws.onopen = () => setSocketStatus(true);
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            var uid = uuid().toString().substring(0, 4);

            if (data.datakind === "m") {
                var time = new Date();

                setMoveList([
                    ...moveList,
                    {
                        idx: uid,
                        read: 1,
                        img_id: data.event_id,
                        time: time,
                    },
                ]);
            }
        };
        return () => clearTimeout(timeout);
    }, [socketStatus, moveList]);

    useEffect(() => {
        if (moveList.length > 0) {
            if (lastMove !== moveList[moveList.length - 1]) {
                setLastMove(moveList[moveList.length - 1]);
            }
        }
    }, [moveList]);

    useEffect(() => {
        for (let i = 0; i < 3; i++) {
            var timeout = setTimeout(() => {
                var image_data = axios
                    .get(
                        `${process.env.REACT_APP_SERVER}images/${lastMove.img_id}`
                    )
                    .then((resp) => {
                        if (resp.data.b64) {
                            setB64Image(resp.data.b64);
                        }
                    });
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [lastMove]);

    /*
    return (<React.Fragment>
    <div className="motion-info">
	<h1>MOTION DETECTED</h1>
	<p>TIME: {lastMove.time.toLocaleString()}</p>
    </div>
    <div className="motion-img">
	    <img src={`data:image/png;base64,${b64Image}`}/>
    </div><React.Fragment/>)
*/
    return (
        <>
            {" "}
            {lastMove.read === 1 ? (
                <>
                    <div className="motion-info">
                        <h1>MOTION DETECTED</h1>
                        <p>TIME: {lastMove.time.toLocaleString()}</p>
                    </div>
                    <div className="motion-img">
                        <img src={`data:image/png;base64,${b64Image}`} />
                    </div>
                </>
            ) : (
                <div className="motion-info">
                    <h1>MOTION NOT DETECTED</h1>
                </div>
            )}
        </>
    );
}
