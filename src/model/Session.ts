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

export const getSeasonIcon = (season: any) => {
    switch (season) {
        case Season.AUTUMN2023:
            return 'leaf';
        case Season.WINTER2023:
            return 'snowflake';
        case Season.SPRING2024:
            return 'flower';
        case Season.SUMMER2024:
            return 'sun';
    }
}

export const getSeason = (date: Date) => {
    const autumn2023 = [new Date(2023, 8, 23), new Date(2023, 11, 21)];
    const winter2023 = [new Date(2024, 11, 22), new Date(2024, 2, 19)];
    const spring2024 = [new Date(2024, 2, 20), new Date(2024, 5, 19)];
    const summer2024 = [new Date(2024, 5, 20), new Date(2024, 8, 21)];

    if (date >= autumn2023[0] && date <= autumn2023[1]) {
        return 'autumn2023';
    } else if (date >= winter2023[0] && date <= winter2023[1]) {
        return 'winter2023';
    } else if (date >= spring2024[0] && date <= spring2024[1]) {
        return 'spring2024';
    } else if (date >= summer2024[0] && date <= summer2024[1]) {
        return 'summer2024';
    } else {
        return '';
    }
}