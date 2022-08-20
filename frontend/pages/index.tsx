import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NavBar from '../components/Navbar'
import Card from '../components/Card'
import ListView from '../components/ListView'
import ChatView from '../components/ChatView'

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