import MobileLayout from "../../Layout/MobileLayout";
import React, {useEffect, useState} from "react";
import SelectPlayerComponent from "../Form/SelectPlayerComponent";
import api from "../../services/api";
import Loading from "../Loading";
import {Player} from "../../model/Player";

const RankingPage = () => {
    const [players, setPlayers] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        players: Array(1).fill(null),
    });
    const [playerStats, setPlayerStats] = useState<any>([]);

    useEffect(() => {
        setIsLoading(true);
        api.get('/player/')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error("Error fetching players:", error);
            });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const id = getIdFromFormData(formData);

        if (id) {
            api.get(`/stats/player/${id}`)
                .then(response => {
                    setPlayerStats(response.data);
                })
                .catch(error => {
                    console.error("Error fetching player stats:", error);
                    setFormData({
                        ...formData,
                        players: Array(1).fill(null),
                    })
                })
        }
        setIsLoading(false);
    }, [formData.players]);
    const selectOptions = players.map((player: Player) => ({
        value: player._id,
        label: `${player.firstname} ${player.lastname.charAt(0)}.`,
    }));

    const getIdFromFormData = (formData: any) => {
        return formData.players.filter((p: any) => p !== null)[0];
    }
    const getBetLabel = (bet: string) => {
        switch (bet) {
            case 'p':
                return 'Petite';
            case 'g':
                return 'Garde';
            case 'gs':
                return 'Garde sans';
            case 'gc':
                return 'Garde contre';
            default:
                return '';
        }
    }

    const getColor = (point: number) => {
        if (point < 0) {
            return 'text-danger';
        } else if (point > 0) {
            return 'text-success';
        } else {
            return 'text-dark';
        }
    }

    return (
        <MobileLayout>
            {
                isLoading ? <Loading/> :
                    <div className="container mt-4">
                        <h1 className="text-center mb-4">Statistiques</h1>
                        <SelectPlayerComponent
                            key={1}
                            index={1}
                            selectedPlayer={selectedPlayer}
                            formData={formData}
                            setFormData={setFormData}
                            selectOptions={selectOptions}
                        />
                        {
                            getIdFromFormData(formData) ?
                                <div className="row">
                                    <div className="col-12">
                                        <div className={"card mt-2"}>
                                            <div className="card-body">
                                                <h6 className="card-title text-center justify-content-start">Taux de
                                                    victoire</h6>
                                                <p className="card-text text-center justify-content-start">{playerStats.winRate} %</p>
                                            </div>
                                        </div>
                                        <div className={"d-flex"}>
                                            <div className="card mt-2 col-6">
                                                <div className="card-body">
                                                    <h6 className="card-text">Parties</h6>
                                                    <p className="card-text">{playerStats.totalGames}</p>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-6"}>
                                                <div className="card-body">
                                                    <h6 className="card-text">Sessions</h6>
                                                    <p className="card-text">{playerStats.totalSessions}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"d-flex"}>
                                            <div className={"card mt-2 col-6"}>
                                                <div className="card-body">
                                                    <h6 className="card-text">Points totaux</h6>
                                                    <p className={`card-text ${getColor(playerStats.totalPoints)}`}>
                                                        {playerStats.totalPoints}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-6"}>
                                                <div className="card-body">
                                                    <h6 className="card-text">En moyenne</h6>
                                                    <p className={`card-text ${getColor(playerStats.averagePointsPerGame)}`}>
                                                        {playerStats.averagePointsPerGame}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className={"card mt-2 col-6"}>
                                                <div className="card-body">
                                                    <h6 className="card-title">Parties preneur</h6>
                                                    <p className="card-text">{playerStats.takerRate} %</p>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-6"}>
                                                <div className="card-body">
                                                    <h6 className="card-title">Parties appelé</h6>
                                                    <p className="card-text">{playerStats.partnerRate} %</p>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            playerStats.bets ?
                                                <div className={"card mt-2 mb-5 d-flex flex-row"}>
                                                    {playerStats.bets.map((bet: any) => (
                                                        <div className="card-body d-flex flex-column">
                                                            <h6 className="card-title">{getBetLabel(bet.bet)}</h6>
                                                            <p className="card-text ">{bet.percentage}%</p>
                                                        </div>
                                                    ))}
                                                </div> : null
                                        }
                                    </div>
                                </div>
                                : null
                        }
                    </div>
            }
        </MobileLayout>
    )
}

export default RankingPage;