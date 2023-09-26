import React, {useState} from "react";
import '../podium.css';
import {Modal, Button} from 'react-bootstrap';

type PlayerPodium = {
    firstname: string,
    lastname: string,
    [key: string]: any
}

type PodiumProps = {
    players: PlayerPodium[],
    dataKey: string,
    percentage?: boolean,
    title: string
}

const Podium = ({players, dataKey, percentage, title}: PodiumProps) => {

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const topThree = players.slice(0, 3);

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
        <>
            <div className="podium">
                <div className={`podium-${getStep(getEqualScoreIndices(topThree, dataKey), 2, 1)}`}>
                    <span className="podium-name">{topThree[1] && getFullName(topThree[1])}</span>
                    {percentage ? `${topThree[1][dataKey].toFixed(2)}% ` : (Math.round(topThree[1][dataKey]))}
                    {(topThree[1].totalGames ? ` (${topThree[1].totalGames})` : null)}
                </div>
                <div className={`podium-${getStep(getEqualScoreIndices(topThree, dataKey), 1, 0)}`}>
                    <span className="podium-name">{topThree[0] && getFullName(topThree[0])}</span>
                    {percentage ? `${topThree[0][dataKey].toFixed(2)}% ` : (Math.round(topThree[0][dataKey]))}
                    {(topThree[0].totalGames ? ` (${topThree[0].totalGames})` : null)}
                </div>
                <div className={`podium-${getStep(getEqualScoreIndices(topThree, dataKey), 3, 2)}`}>
                    <span className="podium-name">{topThree[2] && getFullName(topThree[2])}</span>
                    {percentage ? `${topThree[2][dataKey].toFixed(2)}% ` : (Math.round(topThree[2][dataKey]))}
                    {(topThree[2].totalGames ? ` (${topThree[2].totalGames})` : null)}
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={handleShowModal}
                >
                    Voir le classement complet
                </button>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Position</th>
                            <th>Nom</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((player, index) => (
                            <tr key={index}>
                                <td>
                                    {index === 0 && <span role="img" aria-label="gold medal">🥇</span>}
                                    {index === 1 && <span role="img" aria-label="silver medal">🥈</span>}
                                    {index === 2 && <span role="img" aria-label="bronze medal">🥉</span>}
                                    {index > 2 ? index + 1 : null}
                                </td>
                                <td>{getFullName(player)}</td>
                                <td>{dataKey === 'totalPoints' ? player[dataKey] : player[dataKey].toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default Podium;