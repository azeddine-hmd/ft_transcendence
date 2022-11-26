import {socket} from '../../pages/chat/[chat]'
import Router from "next/router";
import style from '../../styles/chat/ChatCard.module.css'
import { useEffect, useState } from "react";
import { HiSpeakerXMark } from "react-icons/hi2";
import { GiBootKick } from "react-icons/gi";
import { ImBlocked } from "react-icons/im";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'




interface props {
    id: string | undefined;
    name: string | undefined;
    message: string;
    date: string;
    avatar: string | undefined;
    currentUser: boolean;
    role: string;
    state: string;
    room: number;
    showPop: boolean;
}



export default function ChatCard({ name, message, date, avatar, currentUser, role, state, room, showPop }: props) {

    const [isMuteMenu, setMuteMenu] = useState(false);
    const [isBanMenu, setBanMenu] = useState(false);
    const [isKickMenu, setKickMenu] = useState(false);
    const [isInviteMenu, setInviteMenu] = useState(false);

    interface props {
        role:string;
        name: string | undefined;
      }
      
      function classNames(...classes:string[]) {
        return classes.filter(Boolean).join(' ')
      }


      function DropMenu({role, name}:props) {

        var items = [
          "Profile",
          "Message",
          "Block",
          "Invite to game",
          "Mute",
          "Ban",
          "Kick"
        ];
      
        if (role === 'member') {
          items.pop();
          items.pop();
          items.pop();
        }

          useEffect(() => {
              socket.on('blockUser', (isBlocked) => {
                  if (isBlocked)
                      items[2] = 'Unblock';
              })

              socket.on('unblockUser', (isBlocked) => {
                  if (isBlocked)
                      items[2] = 'Block';
              })

              socket.on('inviteAccepted', (isAccepted) => {
                  if (isAccepted)
                      Router.push('/game');
              })

              return () => {
                socket.off('blockUser');
                socket.off('unblockUser');
                socket.off('inviteAccepted');
              }
              
          }, []);

        function handleItemClick(event:string) {
          if (event === "Profile") {
            Router.push("/user/" + name);
          }
          else if (event === "Message") {
            Router.push("/chat/" + name);
            socket.emit('conversation');
          }
          else if (event === "Block") {
            if (items[2] == 'Block')
              socket.emit('blockUser', { user: name });
            else
              socket.emit('unblockUser', { user: name });
          }
          else if (event === "Invite to game") {
            setInviteMenu(true);
          }
          else if (event === "Mute") {
            setMuteMenu(true);
          }
          else if (event === "Ban") {
            setBanMenu(true);
          }
          else if (event === "Kick") {
            setKickMenu(true);
          }
          else {
            console.log(event);
          }
        }
      
        return (
          <Menu as="div" className="relative inline-block text-left w-[12px] mr-6">
            <div>
              <Menu.Button className="h-[12px] inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                ...
                <ChevronDownIcon className="-mr-1 ml-2 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>
      
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Profile'); }} > Profile </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Message'); }} > Message </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Block'); }} > Block </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Invite to game'); }} > Invite to game </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Mute'); }} > Mute </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Ban'); }} > Ban </a> )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => ( <a className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm' )} onClick={() => { handleItemClick('Kick'); }} > Kick </a> )}
                  </Menu.Item>
                  
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )
      }
    
    function Ban() {
        function T1() { socket.emit('Ban', {time: 1, user: name, room: room} ); setBanMenu(false); };
        function T2() { socket.emit('Ban', {time: 3, user: name, room: room} ); setBanMenu(false); };
        function T3() { socket.emit('Ban', {time: 10, user: name, room: room} ); setBanMenu(false); };
        function Cancel() { setBanMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Ban for : </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={T1}>1H</button>
                    <button id={style.messageBarSendBtn} onClick={T2}>3H</button>
                    <button id={style.messageBarSendBtn} onClick={T3}>10H</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }
    
    function Kick() {
        function Confirm() { socket.emit('Kick', {user: name, roomId: room}); setKickMenu(false); };
        function Cancel() { setKickMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Do you want to kick this user? </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={Confirm}>Kick</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }
    
    function Invite() {
        function Confirm() { socket.emit('InviteToGame', {user: name, roomId: room}); setInviteMenu(false); };
        function Cancel() { setInviteMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Do you want to ivite this user to a game? </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={Confirm}>Invite</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }

    function TimePop() {
        function T1() { socket.emit('Mute', {time :1, user: name, room: room} ); setMuteMenu(false); };
        function T2() { socket.emit('Mute', {time :3, user: name, room: room} ); setMuteMenu(false); };
        function T3() { socket.emit('Mute', {time :10, user: name, room: room} ); setMuteMenu(false); };
        function Cancel() { setMuteMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Mute for: </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={T1}>1H</button>
                    <button id={style.messageBarSendBtn} onClick={T2}>3H</button>
                    <button id={style.messageBarSendBtn} onClick={T3}>10H</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className={style.row}>
            <div className={style.column} style={currentUser ? { "float": "right" } : { "float": "left" }}>

                { (isMuteMenu) ? <TimePop /> : <></> }
                { (isBanMenu) ? <Ban /> : <></> }
                { (isKickMenu) ? <Kick /> : <></> }
                { (isInviteMenu) ? <Invite /> : <></> }
                <div className='justify-between' style={{"display": "flex", "justifyContent": "spaceBetween", "alignItems":"center"}}>
                    <div className='flex'>
                        <img src={avatar} style={{ "marginTop": "4px", "width": "40px", "height": "40px", "borderRadius": "50px" }} />
                        <span id={style.username}>{name}</span>
                    </div>
                    { (state == 'blocked') ? <ImBlocked style={{"marginLeft":"5px", "filter":"invert(12%) sepia(97%) saturate(5624%) hue-rotate(358deg) brightness(104%) contrast(114%)"}}/> : <></>}
                    { (state == 'muted') ? <HiSpeakerXMark style={{"marginLeft":"5px"}}/> : <></>}
                    { (state == 'kicked') ? <GiBootKick style={{"marginLeft":"5px"}}/> : <></>}
                    {(!currentUser && showPop) ? <DropMenu role={role} name={name}/> : <></>}
                </div>

                <div className={style.chatcard} style={currentUser ? { "backgroundColor": "#04AA6D" } : { "backgroundColor": "#f6f7fb" }}>
                    <p>{message}</p>
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}