import {Player} from "./Player";
import {Game} from "./Game";

export interface Session {
    _id: string;
    players: {
        player: Player,
        score: number,
    }[];
    games: Game[];
    season: Season|null;
}

export type SessionPlayer = {
    player: Player,
    score: number,
}


export enum Season {
    AUTUMN2023 = 'autumn2023',
    WINTER2023 = 'winter2023',
    SPRING2024 = 'spring2024',
    SUMMER2024 = 'summer2024',
}

export const getSeasonLabel = (season: any) => {
    switch (season) {
        case Season.AUTUMN2023:
            return 'Automne 2023';
        case Season.WINTER2023:
            return 'Hiver 2023/2024';
        case Season.SPRING2024:
            return 'Printemps 2024';
        case Season.SUMMER2024:
            return 'Été 2024';
    }
}