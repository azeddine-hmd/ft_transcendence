import Card from "./Card";
import React, { useState, useEffect } from 'react';
import rooms from '../../rooms.json'
import style from '../../styles/chat/ListView.module.css'
import { io } from "socket.io-client";
import stylee from '../../styles/chat/Card.module.css'


var socket = io('http://localhost:8080', { transports: ['websocket'] });

const handleSubmitCreateNewRoom = () => {
    socket.emit('createRoom', { "title": "topic#", "description": "desc topic#", "privacy": true, "password": "pass123", "owner": { "id": 3, "name": null } });
    socket.emit('findAllRooms');
}

function CreateNewRoom() {
    const [input, setInput] = useState('');

    return (
        <div className={stylee.row}>
            <div className={stylee.column}>
                <div className={stylee.card}>
                    <h3>Create New Room</h3>
                    <input placeholder="title" className={stylee.input} type="text" id="fname"></input><br />
                    <input placeholder="description" className={stylee.input} type="text" id="fname"></input><br />
                    <input placeholder="password (optional)" className={stylee.input} type="password" id="fname" onInput={e => setInput(e.target.value)}></input><br />
                    <div className={style.buttonsHolder}>
                        <button onClick={handleSubmitCreateNewRoom} className={style.button}>Create New Room</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function ListView() {
    const [data, setData] = useState(rooms);

    useEffect(() => {
        socket.emit('findAllRooms')
        socket.on('findAllRooms', ({ rooms }) => {
            setData(rooms)
        })
    }, []);

    return (
        <div className={style.list}>
            <div className={style.buttonsHolder}>
                <button className={style.button}>Rooms</button>
                <button className={style.button}>DM</button>
            </div>
            <div className={style.searchHolder}>
                <input className={style.searchBar} type="text" placeholder="Search.."></input>
            </div>
            <div className={style.scroll}>
            <div>
                <CreateNewRoom />
            </div>
                {data.map(room => {
                    return (
                        <Card title={room.title} description={room.description} members={room.members} uri={room.uri} />
                    );
                })}
            </div>

        </div>

    );
}