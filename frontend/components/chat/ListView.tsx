import Card from "./Card";
import React, { useState, useEffect, FormEventHandler } from 'react';
import rooms from '../../rooms.json'
import style from '../../styles/chat/ListView.module.css'
import { io } from "socket.io-client";
import stylee from '../../styles/chat/Card.module.css'


var socket = io('http://localhost:8080', { transports: ['websocket'] });


function CreateNewRoom() {
    
    const [password, setPassword] = useState('');
    const handlePasswordChange = (event:React.KeyboardEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
        console.log(password);
        
    };
    
    const [description, setDescription] = useState('');
    const handleDescriptionChange = (event:React.KeyboardEvent<HTMLInputElement>) => {
        setDescription(event.currentTarget.value);
        console.log(description);
        
    };
    
    const [title, setTitle] = useState('');
    const handleTitleChange = (event:React.KeyboardEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
        console.log(title);
        
    };
    
    const handleSubmitCreateNewRoom = () => {   
        if (title === '' || description === '')
        {
            alert('all fields marked (*) must ne filled');
            return;
        }
        socket.emit('createRoom', { "title": title, "description": description, "privacy": true, "password": password, "owner": { "id": 1, "name": null } });
        socket.emit('findAllRooms');
    }
    
    return (
        <div className={stylee.row}>
            <div className={stylee.column}>
                <div className={stylee.card}>
                    <h3>Create New Room</h3>
                    <input placeholder="title *" className={stylee.input} type="text" onInput={handleTitleChange}></input><br />
                    <input placeholder="description *" className={stylee.input} type="text" onInput={handleDescriptionChange}></input><br />
                    <input placeholder="password (optional)" className={stylee.input} type="password" onInput={handlePasswordChange}></input><br />
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
        socket.on('createRoom', ({created}) => {
            console.log('created=' + created);
            
        })
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