interface User {
  username: string;
  userId: string;
}

export declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}
