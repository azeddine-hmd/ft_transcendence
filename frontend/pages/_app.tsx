import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "../styles/globals.css";
import { io } from "socket.io-client";

const blacklistPages = [
  "/",
  "/signin",
  "/signup",
  "/logout",
  "/auth/tfa"
];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!blacklistPages.includes(router.asPath)) {
      // allowed pages
      if (!window.statesSocket) {
        window.statesSocket = io(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/states",
          {
            transports: ["websocket"],
            withCredentials: true,
          }
        );
      }  
    } else {
      // disallowed pages
      if (typeof window.statesSocket !== 'undefined') {
        if (window.statesSocket.connected) {
          window.statesSocket.disconnect();
        }
        window.statesSocket = undefined;
      }
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
