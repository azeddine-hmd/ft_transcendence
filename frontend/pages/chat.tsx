import Head from 'next/head'
import styles from '../styles/chat/Layout.module.css'
import NavBar from '../components/utils/Navbar'
import { io } from "socket.io-client";
import ListView from '../components/chat/ListView'
import ChatView from '../components/chat/ChatView'

var socket = io('http://localhost:8080', { transports: ['websocket'], auth: {
    token: 1
}});

export {socket};

function Layout() {
  return (
    <div className={styles.parent}>
      <NavBar/>
      <div className={styles.layout}>
        <ListView/>
        <ChatView/>
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div>
      <Head>
        <title>Chat</title>
      </Head>
      
      <Layout/>
    </div>
  );  
}

export default Chat;