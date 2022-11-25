import { Socket } from "socket.io-client"

declare global {
  interface Window {
    statesSocket?: Socket;
    currentPage: string;
    previousPage: string;
  }
}
