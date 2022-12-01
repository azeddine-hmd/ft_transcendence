import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ErrorResponse } from "../network/dto/response/error-response.dto";
import { localService } from "../network/local.service";
import "../styles/globals.css";

const blacklistPages = [
  "/",
  "/signin",
  "/signup",
  "/logout",
  "/auth/tfa"
];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [displayPage, setDisplayPage] = useState<boolean>(false);

  useEffect(() => {
    if (!blacklistPages.includes(router.asPath)) {
      // allowed pages

      localService.get("/api/auth/verify").then(() => {
        setDisplayPage(true);

        if (!window.statesSocket) {
          window.statesSocket = io(
            process.env.NEXT_PUBLIC_API_BASE_URL + "/states",
            {
              transports: ["websocket"],
              withCredentials: true,
            }
          );
        }  

      }).catch((err: ErrorResponse) => {
          console.log('error while verifying user credentials redirecting to root page');
          router.push("/");
      });

    } else {
      // disallowed pages

      if (typeof window.statesSocket !== 'undefined') {
        if (window.statesSocket.connected) {
          window.statesSocket.disconnect();
        }
        window.statesSocket = undefined;
      }

      localService.get("/api/auth/verify").then(() => {
        router.push("/user/profile");
      }).catch(() => {
          setDisplayPage(true);
      });
    }
  }, [router]);

  return <>{displayPage ? <Component {...pageProps} /> : <></>}</>;
}

export default MyApp;
