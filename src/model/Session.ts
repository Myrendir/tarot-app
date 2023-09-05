import {Player} from "./Player";
import {Game} from "./Game";

export interface Session {
    _id: string;
    players: {
        player: Player,
        score: number,
    }[];
    games: Game[];
}

export type SessionPlayer = {
    player: Player,
    score: number,
}