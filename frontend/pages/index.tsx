import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NavBar from '../components/chat/Navbar'
import Card from '../components/chat/Card'
import ListView from '../components/chat/ListView'
import ChatView from '../components/chat/ChatView'

function Layout() {
  return (
    <div className={styles.layout}>
      <ListView/>
      <ChatView/>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Head>
        <title>Chat</title>
      </Head>
      <NavBar/>
      <Layout/>
    </div>
  );  
}

export default Home;