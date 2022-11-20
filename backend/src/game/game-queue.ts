export class PlayerInfo {
    username: string;
    sockets: string[];
}

export type Matchs = [
    easy: PlayerInfo[],
    hard: PlayerInfo[],
]