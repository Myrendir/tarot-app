export interface Player {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
}

export type PlayerStats = {
    winRate: number,
    bets: [],
    takerRate: number,
    partnerRate: number,
    totalGames: number,
    totalSessions: number,
    totalPoints: number,
    averagePointsPerGame: number
}