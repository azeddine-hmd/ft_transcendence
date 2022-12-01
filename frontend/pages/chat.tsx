import Head from "next/head";
import styles from "../styles/chat/Layout.module.css";
import NavBar from "../components/utils/Navbar";
import { io } from "socket.io-client";
import ListView from "../components/chat/ListView";
import ChatView from "../components/chat/ChatView";
// import localStorage from 'localStorage';

let token = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("access_token");
}

let backendHost = process.env.NEXT_PUBLIC_API_BASE_URL;

// let socket = io('http://localhost:8080', { transports: ['websocket'], auth: {
//   token: token
// }});
const URL = backendHost + "/chat";
let socket = io(URL, {
  withCredentials: true,
  forceNew: true,
  timeout: 10000, //before connect_error and connect_timeout are emitted.
  transports: ["websocket"],
  auth: {
    token: token,
  },
});
export { socket };

function Layout() {
  return (
    <div className={styles.parent}>
      <NavBar />
      <div className={styles.layout}>
        <ListView />
        <ChatView />
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

      <Layout />
    </div>
  );
}

export default Chat;
