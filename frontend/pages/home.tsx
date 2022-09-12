import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Sidebar from '../components/app/Sidebar'
import Main from '../components/app/Main'
import User_matches from '../components/app/User_matches'
import { useState } from 'react'

const Home: NextPage = () => {
  const [isopen, setisopen] = useState(false);
  return (
    <div className="homepage flex h-sceen">
      {isopen ? <div className="backgroundblack absolute  top-0 left-0 w-full h-screen bg-black duration-500 opacity-80" style={{transition:"all 0.9 ease"}}>
        
        </div> : null}
      <Sidebar isopen={isopen} setisopen={setisopen} />
      <Main  isopen={isopen}/>
      <User_matches isopen={isopen}/>
    </div>

  )
}

export default Home;