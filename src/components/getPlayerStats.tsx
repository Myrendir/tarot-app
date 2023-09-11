import {useEffect, useState} from "react";
import {PlayerStats} from "../model/Player";
import api from "../services/api";


const getPlayerStats = async (playerId: string) => {

    const [playerStats, setPlayerStats] = useState<PlayerStats>(
        {
            winRate: 0,
            bets: [],
            takerRate: 0,
            partnerRate: 0,
            totalGames: 0,
            totalSessions: 0,
            totalPoints: 0,
            averagePointsPerGame: 0
        }
    );

    useEffect(() => {
        api.get(`/stats/player/${playerId}`)
            .then(response => {
                setPlayerStats(response.data);
            }).catch(error => {
            console.error("Error fetching player stats:", error);
        })
    }, [playerId]);

    console.log(playerStats)
    return (
        <div>

        </div>
    )
}
export default getPlayerStats;