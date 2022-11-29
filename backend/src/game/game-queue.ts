export class PlayerInfo {
    username: string;
    sockets: string[];
}

export type Matchs = [
    easy: PlayerInfo[],
    hard: PlayerInfo[],
]

export class PlayerInfoChat {
    username: string;
    sockets: string[];
}

export type MatchsChat = [
    easy: PlayerInfoChat[],
    hard: PlayerInfoChat[],
]