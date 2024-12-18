import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../services/api';
import {getSeason, getSeasonLabel, Season, Session, SessionPlayer} from '../model/Session';
import {BET, PETIT_AU_BOUT, TIPS, MAX_SCORE} from '../model/Game';
import Modal from 'react-modal';
import {Modal as BootstrapModal, Button} from "react-bootstrap";
import MobileLayout from "../Layout/MobileLayout";
import SaveButton from "./Button/SaveButton";
import {toastr} from "react-redux-toastr";
import ResetButton from "./Button/ResetButton";
import Loading from "./Loading";
import {FaCrown, FaStar} from 'react-icons/fa'
import {BsFillArrowLeftCircleFill} from 'react-icons/bs'
import {Player} from "../model/Player";
import PumpkinIco from "./Icons/seasons/PumpkinIco";
import FlowerIco from "./Icons/seasons/FlowerIco";
import SnowIco from "./Icons/seasons/SnowIco";
import SunIco from "./Icons/seasons/SunIco";
import SeasonTitle from "./SeasonTitle";
import SelectPlayerComponent from "./Form/SelectPlayerComponent";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

Modal.setAppElement('#root');

const SessionDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [session, setSession] = useState<Session | null>(null);
    const [bet, setBet] = useState('');
    const [taker, setTaker] = useState('');
    const [partner, setPartner] = useState('');
    const [tip, setTip] = useState(0);
    const [attackingTeamScore, setAttackingTeamScore] = useState(0);
    const [defendingTeamScore, setDefendingTeamScore] = useState(0);
    const [petitAuBoutWon, setPetitAuBoutWon] = useState('');
    const [chelemWon, setChelemWon] = useState(false);
    const [hugeChelemWon, setHugeChelemWon] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddStarModal, setShowAddStarModal] = useState(false);
    const [guilty, setGuilty] = useState('');
    const [guiltyType, setGuiltyType] = useState('');
    const [showChangePlayerModal, setShowChangePlayerModal] = useState(false);
    const [changePlayerFormData, setChangePlayerFormData] = useState({ players: ['', ''] });
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);

    const slideAmount = 200;

    const handleAddStar = () => {
        setShowAddStarModal(!showAddStarModal);
    }

    const addStar = async () => {
        if (guilty === '') {
            toastr.error('Erreur', 'Il faut sélectionner un joueur.', {timeOut: 3000});
            return;
        }

        if (guiltyType === '') {
            toastr.error('Erreur', 'Il faut sélectionner un type d\'erreur.', {timeOut: 3000});
            return;
        }


        api
            .post(`/session/addStar/${id}/${guilty}`, {
                type: guiltyType
            })
            .then(() => {
                toastr.success('Succès', 'L\'étoile a été ajoutée.', {timeOut: 3000});
                setShowAddStarModal(false);
                setGuilty('');
                setGuiltyType('');
                fetchSession();
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de l'étoile:", error);
            })
    }
    const setDeleteModalOpen = async () => {
        setShowDeleteModal(false);
        await deleteLastGame();
    };
    const handleLeftSlide = () => {
        if (offset < 0) setOffset(offset + slideAmount);
    };

    const handleRightSlide = () => {
        setOffset(offset - slideAmount);
    };

    const handleAttackingScoreChange = (score: number) => {
        if (score <= MAX_SCORE) {
            setAttackingTeamScore(score);
            setDefendingTeamScore(MAX_SCORE - score);
        }
    };

    const handleDefendingScoreChange = (score: number) => {
        if (score <= MAX_SCORE) {
            setDefendingTeamScore(score);
            setAttackingTeamScore(MAX_SCORE - score);
        }
    };

    const fetchSession = async () => {
        try {
            const response = await api.get(`/session/${id}`);
            const playerDetailsPromises = response.data.players.map((p: {
                player: string;
            }) => api.get(`/player/${p.player}`));
            const playersDetails = await Promise.all(playerDetailsPromises);
            const completeSessionData = {
                ...response.data,
                players: response.data.players.map((p: SessionPlayer, index: number) => ({
                    ...p,
                    player: playersDetails[index].data.data
                })),
                games: response.data.games,
            };

            setSession(completeSessionData);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération de la session:", error);
        }
    };

    useEffect(() => {
        fetchSession();
        // eslint-disable-next-line
    }, [id]);

    const handleReset = () => {
        setBet('');
        setTaker('');
        setPartner('');
        setTip(0);
        setAttackingTeamScore(0);
        setDefendingTeamScore(0);
        setPetitAuBoutWon('');
        setChelemWon(false);
        setHugeChelemWon(false);
    }

    const handleAddGame = async () => {

        if (taker === '') {
            toastr.error('Erreur', 'Il faut un preneur.', {timeOut: 3000});
            return;
        }
        if (bet === '') {
            toastr.error('Erreur', 'Il faut un contrat.', {timeOut: 3000});
            return;
        }
        if ((attackingTeamScore + defendingTeamScore) === 0) {
            toastr.error('Erreur', 'Il faut renseigner des puntos.', {timeOut: 3000});
            return;
        }

        try {
            const game = {
                players: session?.players.map(player => ({player: player.player._id})) || [],
                bet,
                taker,
                partner,
                tip,
                attackingTeamScore,
                defendingTeamScore,
                petitAuBoutWon,
                chelemWon,
                hugeChelemWon,
            };

            await api.post(`/session/${id}/addGame/`, game);

            toastr.success('Succès', 'Les points ont été ajoutés à la session.', {timeOut: 3000});
            handleReset();
            fetchSession();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toastr.warning('Hopopop', error.response.data.message, {timeOut: 3000});
                return;
            }
            console.error("Erreur lors de l'ajout du jeu:", error);
        }
    };

    const getSessionPoints = (session: Session | null) => {
        const result: { [key: string]: number }[] = [];
        const sessionPoints: { [key: string]: number } = {};

        session?.players.forEach(player => {
            sessionPoints[player.player.username] = player.score;
        });

        result.push(sessionPoints);

        session?.games.forEach(game => {
            const gamePoints: { [key: string]: number } = {};
            game.players.forEach(player => {
                const previousGamePoints = result[result.length - 1][player.player.username];
                gamePoints[player.player.username] = (previousGamePoints - player.score);
            });

            result.push(gamePoints);
        });

        return result;
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
    const sessionPoints = getSessionPoints(session);
    sessionPoints.pop();

    const deleteLastGame = async () => {
        if (session?.games.length === 0) {
            toastr.error('Erreur', 'Il n\'y a aucune partie à supprimer.', {timeOut: 3000});
            return;
        }
        try {
            await api.delete(`/session/${id}/deleteLastGame`);
            toastr.success('Succès', 'La dernière partie a été supprimée.', {timeOut: 3000});
            fetchSession();
        } catch (error) {
            console.error("Erreur lors de la suppression du dernier jeu:", error);
        }
    }

    const isCurrentSeason = (): boolean => {
        if (!session) {
            return false;
        }
        const currentSeason = getSeason(new Date());

        return session.season === currentSeason;
    }

    const highestScore = session?.players.reduce((max, player) => player.score > max ? player.score : max, -Infinity);
    // @ts-ignore
    const secondHighestScore = session?.players.reduce((max, player) => player.score > max && player.score < highestScore ? player.score : max, -Infinity);

    const renderStars = (player: Player) => {
        const pendingStars = player.stars.length % 3;
        if (pendingStars === 0) {
            return null; // Return null to render nothing
        }

        const stars = [];
        for (let i = 0; i < pendingStars; i++) {
            stars.push(<FaStar style={{
                paddingBottom: '2px',
            }} key={i} color={"#c43d27"}/>);
        }

        return stars;
    }

    const fetchAvailablePlayers = async () => {
        try {
            const response = await api.get('/player');
            const currentPlayerIds = session?.players.map(p => p.player._id) || [];
            const availablePlayers = response.data.filter((p: Player) => !currentPlayerIds.includes(p._id));
            setAvailablePlayers(availablePlayers);
        } catch (error) {
            console.error("Erreur lors de la récupération des joueurs:", error);
        }
    };

    const getPlayerSelectOptions = (players: Player[]) => {
        return players.map(player => ({
            value: player._id,
            label: `${player.firstname} ${player.lastname.charAt(0).toUpperCase()}.`
        }));
    };

    const handleChangePlayer = async () => {
        if (!changePlayerFormData.players[0] || !changePlayerFormData.players[1]) {
            toastr.error('Erreur', 'Veuillez sélectionner les deux joueurs.', {timeOut: 3000});
            return;
        }

        try {
            const response = await api.put(`/session/${id}/changePlayer`, {
                oldPlayerId: changePlayerFormData.players[0],
                newPlayerId: changePlayerFormData.players[1]
            });

            toastr.success('Succès', 'Le joueur a été remplacé.', {timeOut: 3000});
            setShowChangePlayerModal(false);
            setChangePlayerFormData({ players: ['', ''] });

            // Redirect to the new/existing session
            if (response.data.session._id !== id) {
                navigate(`/session/${response.data.session._id}`);
            } else {
                fetchSession();
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toastr.error('Erreur', error.response.data.message, {timeOut: 3000});
            } else {
                toastr.error('Erreur', 'Une erreur est survenue lors du changement de joueur.', {timeOut: 3000});
            }
        }
    };

    useEffect(() => {
        if (showChangePlayerModal) {
            fetchAvailablePlayers();
        }
    }, [showChangePlayerModal]);

    const getLastFiveGamesScores = () => {
        if (!session) return null;

        // Get last 5 games
        const lastGames = session.games.slice(-5);
        const scores: { [key: string]: number[] } = {};


        // Initialize scores for each player with empty arrays
        session.players.forEach(player => {
            scores[player.player.username] = [];
        });

        // Calculate cumulative scores for each game
        lastGames.forEach((game, gameIndex) => {
            
            // For each player, get their current total and add this game's score
            session.players.forEach(sessionPlayer => {
                
                const gamePlayer = game.players.find(
                    p => p.player._id === sessionPlayer.player._id
                );
                
                
                if (gamePlayer) {
                    const previousScore = scores[sessionPlayer.player.username][gameIndex - 1] || 0;  // Use 0 if it's the first game
                    const newScore = previousScore + gamePlayer.score;
                    scores[sessionPlayer.player.username][gameIndex] = newScore;
                }
            });
        });

        // Create labels based on the number of games from the end
        const gameLabels = lastGames.map((_, idx) => {
            const gamesFromEnd = lastGames.length - idx;
            return `Partie N-${gamesFromEnd}`;
        });

        const chartData = {
            labels: gameLabels,
            datasets: Object.entries(scores).map(([username, scores], index) => ({
                label: username,
                data: scores,
                borderColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ][index % 5],
                fill: false,
                tension: 0.1
            }))
        };
        return chartData;
    };

    return (
        <MobileLayout>
            {isLoading && <Loading/>}
            <div className="container mt-4">
                <SeasonTitle season={session?.season as Season} isFinal={false}/>
                <table className="table table-bordered mb-4" onClick={() => setModalOpen(true)}>
                    <thead>
                    <tr>
                        <th>Nom du joueur</th>
                        <th>{`Score sur ${session?.games.length} partie${(session?.games && (session?.games.length > 1)) ? 's' : ''}`} </th>
                    </tr>
                    </thead>
                    <tbody>
                    {session?.players.map((player) => (
                        <tr key={player.player._id}>
                            <td className={'d-flex'} style={{justifyContent: 'space-between'}}>
                                <div>
                                    {player.player.firstname + ' ' + player.player.lastname.charAt(0).toUpperCase() + '. '}
                                    {renderStars(player.player)}
                                </div>
                                {
                                    session?.games.length > 0 && (
                                        <div>
                                            {player.score === highestScore && <FaCrown size={25} style={{
                                                paddingBottom: '2px',
                                            }} color={'gold'}/>}
                                            {player.score === secondHighestScore && <FaCrown size={25} style={{
                                                paddingBottom: '2px',
                                            }} color={'silver'}/>}
                                        </div>
                                    )
                                }
                            </td>
                            <td style={{
                                color: player.score > 0 ? 'green' : player.score < 0 ? 'red' : undefined
                            }}>
                                {player.score}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                {
                    isCurrentSeason() ? (
                        <div className="d-flex gap-4 mb-2 px-2">
                            <button 
                                type="button" 
                                className="btn btn-dark btn-sm flex-grow-1" 
                                style={{
                                    fontSize: '0.7rem',
                                    margin: '0 4px'
                                }} 
                                onClick={() => handleAddStar()}
                            >
                                <i className="fa fa-star"/> Ajouter une étoile
                            </button>
                            
                            {session?.games && session?.games.length > 0 ? (
                                <button 
                                    type="button" 
                                    className="btn btn-warning btn-sm flex-grow-1" 
                                    style={{
                                        fontSize: '0.7rem',
                                        margin: '0 4px'
                                    }} 
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Annuler la dernière partie
                                </button>
                            ) : null}
                            
                            <button 
                                type="button" 
                                className="btn btn-primary btn-sm flex-grow-1" 
                                style={{
                                    fontSize: '0.7rem',
                                    margin: '0 4px'
                                }} 
                                onClick={() => setShowChangePlayerModal(true)}
                            >
                                Changer un joueur
                            </button>
                        </div>
                    ) : null
                }

                <BootstrapModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <BootstrapModal.Header>
                        <BootstrapModal.Title>Confirmation</BootstrapModal.Title>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body>Êtes-vous sûr de vouloir annuler la dernière partie?</BootstrapModal.Body>
                    <BootstrapModal.Footer>
                        <div className="d-flex justify-content-center w-100">
                            <div className={"m-1"}>
                                <button 
                                    className="btn btn-danger rounded-pill" 
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                            <div className={"m-1"}>
                                <button 
                                    className="btn btn-primary rounded-pill" 
                                    onClick={() => setDeleteModalOpen()}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </BootstrapModal.Footer>
                </BootstrapModal>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            zIndex: 9999
                        },
                        content: {
                            height: '75%',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }}
                >
                    <h4>Évolution des scores</h4>
                    {getLastFiveGamesScores() && (
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Line
                                data={getLastFiveGamesScores()!}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top' as const,
                                        },
                                        title: {
                                            display: false,
                                            text: 'Historique des 5 dernières parties'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </Modal>
                <Modal isOpen={showAddStarModal} onRequestClose={handleAddStar}
                       style={{
                           overlay: {
                               backgroundColor: 'rgba(0, 0, 0, 0.75)',
                               zIndex: 9999
                           },
                           content: {height: 'calc(40%)'}
                       }}

                >
                    <h3>Ajouter une étoile</h3>
                    <div className="row">
                        <div className="col-md-12">
                            <h6>Joueur</h6>
                            <select className="form-control" value={guilty} onChange={(e) => setGuilty(e.target.value)}>
                                <option value=''>Sélectionner un joueur</option>
                                {session?.players.map(player => (
                                    <option key={player.player._id}
                                            value={player.player._id}>{`${player.player.firstname} ${player.player.lastname.charAt(0).toUpperCase()}.`}</option>
                                ))}
                            </select>
                            <h6 className="mt-1">Type d'erreur</h6>
                            <select className="form-control"
                                    value={guiltyType}
                                    onChange={(e) => setGuiltyType(e.target.value)}>
                                <option value=''>Sélectionner un type d'erreur</option>
                                <option value='distribution'>Distribution</option>
                                <option value='parle'>Parlante</option>
                                <option value='jeu'>Faute de jeu</option>
                                <option value='insulte'>Insulte</option>
                            </select>

                            <div className="d-flex justify-content-center mt-2">
                                <div className={"m-1"}>
                                    <button className="btn btn-danger rounded-pill" onClick={() => {
                                        handleAddStar();
                                        setGuilty('');
                                        setGuiltyType('');
                                    }}>Annuler
                                    </button>
                                </div>
                                <div className={"m-1"}>
                                    <button className="btn btn-primary rounded-pill" onClick={addStar}>Ajouter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={showChangePlayerModal}
                    onRequestClose={() => setShowChangePlayerModal(false)}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            zIndex: 9999
                        },
                        content: {height: 'calc(40%)'}
                    }}
                >
                    <h3>Changer un joueur</h3>
                    <div className="row">
                        <div className="col-md-12">
                            <h6>Joueur à remplacer</h6>
                            <SelectPlayerComponent
                                index={0}
                                selectedPlayer={changePlayerFormData.players[0]}
                                formData={changePlayerFormData}
                                setFormData={setChangePlayerFormData}
                                selectOptions={getPlayerSelectOptions(session?.players.map(p => p.player) || [])}
                            />

                            <h6 className="mt-3">Nouveau joueur</h6>
                            <SelectPlayerComponent
                                index={1}
                                selectedPlayer={changePlayerFormData.players[1]}
                                formData={changePlayerFormData}
                                setFormData={setChangePlayerFormData}
                                selectOptions={getPlayerSelectOptions(availablePlayers)}
                            />

                            <div className="d-flex justify-content-center mt-2">
                                <div className={"m-1"}>
                                    <button 
                                        className="btn btn-danger rounded-pill" 
                                        onClick={() => {
                                            setShowChangePlayerModal(false);
                                            setChangePlayerFormData({ players: ['', ''] });
                                        }}
                                    >
                                        Annuler
                                    </button>
                                </div>
                                <div className={"m-1"}>
                                    <button 
                                        className="btn btn-primary rounded-pill" 
                                        onClick={handleChangePlayer}
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                {/* Form */}
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <label>Preneur :</label>
                            <select className="form-control" value={taker} onChange={(e) => setTaker(e.target.value)}>
                                <option value=''>Sélectionner un preneur</option>
                                {session?.players.map(player => (
                                    (player.player._id !== partner) &&
                                    <option key={player.player._id}
                                            value={player.player._id}>{`${player.player.firstname} ${player.player.lastname.charAt(0).toUpperCase()}.`}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Appelé :</label>
                            <select className="form-control"
                                    value={partner}
                                    onChange={(e) => setPartner(e.target.value)}>
                                <option value=''>Aucun</option>
                                {session?.players.map(player => (
                                    (player.player._id !== taker) &&
                                    <option key={player.player._id}
                                            value={player.player._id}>{`${player.player.firstname} ${player.player.lastname.charAt(0).toUpperCase()}.`}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Contrat :</label>
                            <select className="form-control" value={bet} onChange={(e) => setBet(e.target.value)}>
                                <option value=''>Sélectionner une enchère</option>
                                {BET.map(b => (
                                    <option key={b} value={b}>{getBetLabel(b)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Score de l'attaque :</label>

                            <input
                                className="form-control"
                                min={0}
                                step={0.5}
                                type="number"
                                value={attackingTeamScore}
                                onChange={(e) => handleAttackingScoreChange(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label>Score de la défense :</label>
                            <input
                                className="form-control"
                                min={0}
                                step={0.5}
                                type="number"
                                value={defendingTeamScore}
                                onChange={(e) => handleDefendingScoreChange(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label>Nb de bouts :</label>
                            <select className="form-control"
                                    value={tip}
                                    onChange={(e) => setTip(parseInt(e.target.value))}>
                                {TIPS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Petit au bout</label>
                            <select className="form-control"
                                    value={petitAuBoutWon}
                                    onChange={(e) => setPetitAuBoutWon(e.target.value)}>
                                {PETIT_AU_BOUT.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex pt-3" style={{justifyContent: 'space-between'}}>
                            <div className="custom-control custom-switch align-items-center">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="chelemSwitch"
                                    checked={chelemWon}
                                    onChange={(e) => {
                                        setChelemWon(e.target.checked)
                                        if (e.target.checked) {
                                            setHugeChelemWon(false);
                                        }
                                    }}
                                />
                                <label className="custom-control-label" htmlFor="chelemSwitch">Petit chelem</label>
                            </div>

                            <div className="custom-control custom-switch align-items-center">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="hugeChelemSwitch"
                                    checked={hugeChelemWon}
                                    onChange={(e) => {
                                        setHugeChelemWon(e.target.checked)
                                        if (e.target.checked) {
                                            setChelemWon(false);
                                        }
                                    }}
                                />
                                <label className="custom-control-label" htmlFor="hugeChelemSwitch">Grand chelem</label>
                            </div>
                        </div>
                        {
                            (!isModalOpen && isCurrentSeason()) && (
                                <div className="d-flex justify-content-center pt-3 pb-3">
                                    <SaveButton onClick={handleAddGame}/>
                                    <ResetButton onClick={handleReset}/>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </MobileLayout>
    );
};

export default SessionDetail;
