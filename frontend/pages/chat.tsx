import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/chat/Layout.module.css'
import NavBar from '../components/utils/Navbar'
import Card from '../components/chat/Card'
import ListView from '../components/chat/ListView'
import ChatView from '../components/chat/ChatView'


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