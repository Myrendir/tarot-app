import MobileLayout from "../../Layout/MobileLayout";
import React, {useEffect, useState} from "react";
import SelectPlayerComponent from "../Form/SelectPlayerComponent";
import api from "../../services/api";
import Loading from "../Loading";
import {Player} from "../../model/Player";
import Trophy from "../Icons/statistics/Trophy";

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

    const getBetColor = (bets: any, bet: any) => {

        let highestPercentage = 0;
        bets.forEach((b: any) => {
            const percentage = parseFloat(b.percentage);
            if (percentage > highestPercentage) {
                highestPercentage = percentage;
            }
        });

        return (highestPercentage === parseFloat(bet.percentage) ? 'var(--Bleu, #054A81)' : 'grey');
    };


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
                return 'G. sans';
            case 'gc':
                return 'G. contre';
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
                                        <div className="card mt-1" style={{borderRadius: "14px"}}>
                                            <div className="card-body text-center">
                                                <Trophy/>
                                                <p className="card-title text-center justify-content-start"
                                                   style={{fontWeight: "bold"}}>
                                                    Taux de victoire
                                                </p>
                                                <h3 className="card-text text-center justify-content-start" style={{
                                                    color: 'var(--Bleu, #054A81)', fontSize: '2rem'

                                                }}>
                                                    {playerStats.winRate} %
                                                </h3>
                                            </div>
                                        </div>
                                        <div className={"d-flex "}>
                                            <div className="card mt-2 col-4 mr-1" style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Parties</p>
                                                    <h3 style={{
                                                        color: "var(--Bleu, #054A81)",
                                                        fontSize: '2rem'
                                                    }}>{playerStats.totalGames}</h3>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-4 mr-1"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Sessions</p>
                                                    <h3 style={{
                                                        color: "var(--Bleu, #054A81)",
                                                        fontSize: '2rem'
                                                    }}>{playerStats.totalSessions}</h3>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-4"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Étoiles</p>
                                                    <h3 style={{
                                                        color: "rgb(196, 61, 39",
                                                        fontSize: '2rem'
                                                    }}>{playerStats.stars}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"d-flex"}>
                                            <div className={"card mt-2 col-6 mr-2"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Points totaux</p>
                                                    <h3 className={`${getColor(playerStats.totalPoints)}`}>
                                                        {playerStats.totalPoints}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-6"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>En moyenne</p>
                                                    <h3 className={`${getColor(playerStats.averagePointsPerGame)}`}>
                                                        {playerStats.averagePointsPerGame}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className={"card mt-2 col-6 mr-2"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Parties preneur</p>
                                                    <h3 style={{
                                                        color: 'var(--Bleu, #054A81)',
                                                        fontSize: '2rem'
                                                    }}>{playerStats.takerRate} %</h3>
                                                </div>
                                            </div>
                                            <div className={"card mt-2 col-6"} style={{borderRadius: "14px"}}>
                                                <div className="text-start pt-3">
                                                    <p style={{fontWeight: "bold"}}>Parties appelé</p>
                                                    <h3 style={{
                                                        color: 'var(--Bleu, #054A81)',
                                                        fontSize: '2rem'
                                                    }}>{playerStats.partnerRate} %</h3>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            playerStats.bets ?
                                                <div className="d-flex justify-content-center">
                                                    <div className={"card mt-2 mb-5 d-flex flex-row justify-content-around"}
                                                         style={{borderRadius: "14px"}}>
                                                        {playerStats.bets.map((bet: any, index: number) => (
                                                            <div className="text-center d-flex flex-column"
                                                                 style={{
                                                                     borderRight: index !== playerStats.bets.length - 1 ? '1px solid #DDD' : '',
                                                                     borderStartEndRadius: index !== playerStats.bets.length - 1 ? '14px' : '',
                                                                     padding: "0 8px",
                                                                 }}>
                                                                <p style={{fontWeight: "bold"}}>{getBetLabel(bet.bet)}</p>
                                                                <h5 style={{
                                                                    color: `${getBetColor(playerStats.bets, bet)}`,
                                                                    fontWeight: "bold"
                                                                }}>{bet.percentage}%</h5>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                : null
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