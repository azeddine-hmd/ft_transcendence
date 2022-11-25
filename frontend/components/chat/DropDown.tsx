import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {socket} from '../../pages/chat/[chat]'
import Router from "next/router";


interface props {
  role:string;
  name: string | undefined;
}

function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DropMenu({role, name}:props) {

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

    socket.off('blockUser');
    socket.off('unblockUser');
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
      socket.emit('showMenuAlert', {flag:'Invite'});
    }
    else if (event === "Mute") {
      socket.emit('showMenuAlert', {flag:'Mute'});
    }
    else if (event === "Ban") {
      socket.emit('showMenuAlert', {flag:'Ban'});
    }
    else if (event === "Kick") {
      socket.emit('showMenuAlert', {flag:'Kick'});
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