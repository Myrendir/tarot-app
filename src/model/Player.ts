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