import React from "react";
import '../podium.css';

const Podium = (players: any) => {
    players = players.players;

    const getFullName = (player: any) => {
        return `${player.playerFirstname} ${player.playerLastname.charAt(0).toUpperCase()}.`;
    }

    const getValue = (player: any) => {
      return player.count ? player.count : player.totalPoints;
    }
    return (
        <div className="podium">
            <div className="podium-2">
                <span className="podium-name">{players[1] && getFullName(players[1])}</span>
                {getValue(players[1])}
            </div>
            <div className="podium-1">
                <span className="podium-name">{players[0] && getFullName(players[0])}</span>
                {getValue(players[0])}
            </div>
            <div className="podium-3">
                <span className="podium-name">{players[2] && getFullName(players[2])}</span>
                {getValue(players[2])}
            </div>
        </div>
    )
};

export default Podium;