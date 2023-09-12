import React from "react";
import '../podium.css';

type PlayerPodium = {
    firstname: string,
    lastname: string,
    [key: string]: any
}

type PodiumProps = {
    players: PlayerPodium[],
    dataKey: string,
    percentage?: boolean
}

const Podium = ({players, dataKey, percentage}: PodiumProps) => {

    const getFullName = (player: PlayerPodium) => {
        return `${player.firstname} ${player.lastname.charAt(0).toUpperCase()}.`;
    }

    const getEqualScoreIndices = (players: PlayerPodium[], key: string): number[] => {
        const scores = players.map(player => player[key]);
        const scoreOccurrences: { [key: number]: number[] } = {};

        scores.forEach((score, index) => {
            if (!scoreOccurrences[score]) {
                scoreOccurrences[score] = [];
            }
            scoreOccurrences[score].push(index);
        });

        return Object.values(scoreOccurrences)
            .filter(indices => indices.length > 1)
            .flat();
    }


    const getStep = (indices: number[], defaultStep: number, playerIndex: number): number => {
        if (indices.length === 2) {
            if (indices.includes(0) && indices.includes(1) && indices.includes(playerIndex)) {
                return 1;
            }
            if (indices.includes(1) && indices.includes(2) && indices.includes(playerIndex)) {
                return 2;
            }
        }

        if (indices.length === 3) {
            return 1;
        }

        return defaultStep
    }

    return (

        <div className="podium">
            <div className={`podium-${getStep(getEqualScoreIndices(players, dataKey), 2, 1)}`}>
                <span className="podium-name">{players[1] && getFullName(players[1])}</span>
                {percentage ? `${players[1][dataKey].toFixed(2)}% ` : (Math.round(players[1][dataKey]))}
                {(players[1].totalGames ? ` (${players[1].totalGames})` : null)}
            </div>
            <div className={`podium-${getStep(getEqualScoreIndices(players, dataKey), 1, 0)}`}>
                <span className="podium-name">{players[0] && getFullName(players[0])}</span>
                {percentage ? `${players[0][dataKey].toFixed(2)}% ` : (Math.round(players[0][dataKey]))}
                {(players[0].totalGames ? ` (${players[0].totalGames})` : null)}
            </div>
            <div className={`podium-${getStep(getEqualScoreIndices(players, dataKey), 3, 2)}`}>
                <span className="podium-name">{players[2] && getFullName(players[2])}</span>
                {percentage ? `${players[2][dataKey].toFixed(2)}% ` : (Math.round(players[2][dataKey]))}
                {(players[2].totalGames ? ` (${players[2].totalGames})` : null)}
            </div>
        </div>
    )
};

export default Podium;