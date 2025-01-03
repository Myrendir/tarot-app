import {Player} from "./Player";
import {Game} from "./Game";

const autumn2023 = [new Date(2023, 8, 23), new Date(2023, 11, 21, 23, 59, 59)];
const winter2023 = [new Date(2023, 11, 22), new Date(2024, 2, 22, 0, 5, 0)];
const spring2024 = [new Date(2024, 2, 22, 0, 5, 1), new Date(2024, 5, 19, 23, 59, 59)];
const summer2024 = [new Date(2024, 5, 20), new Date(2024, 8, 21, 23, 59, 59)];
const autumn2024 = [new Date(2024, 8, 22), new Date(2024, 11, 21, 23, 59, 59)];
const winter2024 = [new Date(2024, 11, 22), new Date(2025, 2, 19, 23, 59, 59)];
const spring2025 = [new Date(2025, 2, 20), new Date(2025, 5, 20, 23, 59, 59)];
const seasons = [
    autumn2023,
    winter2023,
    spring2024,
    summer2024,
    autumn2024,
    winter2024,
    spring2025,
];

export interface Session {
    _id: string;
    players: {
        player: Player,
        score: number,
    }[];
    games: Game[];
    season: Season | null;
}

export type SessionPlayer = {
    player: Player,
    firstname?: string,
    lastname?: string,
    score: number,
}


export enum Season {
    AUTUMN2023 = 'autumn2023',
    WINTER2023 = 'winter2023',
    SPRING2024 = 'spring2024',
    SUMMER2024 = 'summer2024',
    AUTUMN2024 = 'autumn2024',
    WINTER2024 = 'winter2024',
    SPRING2025 = 'spring2025',
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
        case Season.AUTUMN2024:
            return 'Automne 2024';
        case Season.WINTER2024:
            return 'Hiver 2024/2025';
        case Season.SPRING2025:
            return 'Printemps 2025';
    }
}

export const getSeason = (date: Date) => {

    if (date >= autumn2023[0] && date <= autumn2023[1]) {
        return 'autumn2023';
    } else if (date >= winter2023[0] && date <= winter2023[1]) {
        return 'winter2023';
    } else if (date >= spring2024[0] && date <= spring2024[1]) {
        return 'spring2024';
    } else if (date >= summer2024[0] && date <= summer2024[1]) {
        return 'summer2024';
    } else if (date >= autumn2024[0] && date <= autumn2024[1]) {
        return 'autumn2024';
    } else if (date >= winter2024[0] && date <= winter2024[1]) {
        return 'winter2024';
    } else if (date >= spring2025[0] && date <= spring2025[1]) {
        return 'spring2025'
    } else {
        return '';
    }
}

export const isLastDayOfSeason = (date: Date) => {
    let isLastDayOfSeason = false;

    seasons.forEach((season) => {
        if (date === season[1]) {
            if (date.getHours() >= 18 && (date.getHours() <= 23 && date.getMinutes() <= 59 && date.getSeconds() <= 59)) {
                isLastDayOfSeason = true;
            }
        }
    });

    return isLastDayOfSeason;

}

export const getEntriesBefore = (seasonEnum: any, limit: string) => {
    const entries: string[] = [];
    for (const key in seasonEnum) {
        if (seasonEnum[key] === limit) {
            break;
        }
        entries.push(seasonEnum[key]);
    }
    return entries;
}