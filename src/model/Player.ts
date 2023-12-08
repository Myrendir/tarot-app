export interface Player {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    stars: any;
}

export type PlayerStats = {
    winRate: number,
    stars: number,
    bets: [],
    takerRate: number,
    partnerRate: number,
    totalGames: number,
    totalSessions: number,
    totalPoints: number,
    averagePointsPerGame: number
}

export type PlayerPodium = {
    firstname: string,
    lastname: string,
    [key: string]: any
}

export const getPlayerFullname = (player: Player | PlayerPodium) => {
    return `${player.firstname} ${player.lastname.charAt(0).toUpperCase()}.`;
}