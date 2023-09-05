import {Player} from "./Player";
import {Key} from "react";


export interface Game {
    _id: Key | null | undefined;
    players: {
        player: Player,
        score: number,
    }[]
    bet: string;
    taker: string;
    partner: string | null;
    tip: number;
    attackingTeamScore: number;
    defendingTeamScore: number;
    petitAuBoutWon: string;
    chelemWon: boolean;
    hugeChelemWon: boolean;
}

export const MAX_SCORE = 91;
export const BET = [
    'p',
    'g',
    'gs',
    'gc'
]

export const PETIT_AU_BOUT = [
    '',
    'gagné',
    'perdu',
];

export const TIPS = [
    0,
    1,
    2,
    3
];