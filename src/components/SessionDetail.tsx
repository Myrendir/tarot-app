import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';
import {getSeasonLabel, Session, SessionPlayer} from '../model/Session';
import {BET, PETIT_AU_BOUT, TIPS, MAX_SCORE} from '../model/Game';
import Modal from 'react-modal';
import {Modal as BootstrapModal, Button} from "react-bootstrap";
import MobileLayout from "../Layout/MobileLayout";
import SaveButton from "./Button/SaveButton";
import {toastr} from "react-redux-toastr";
import ResetButton from "./Button/ResetButton";
import Loading from "./Loading";
import {addSessionIdToLocalStorage} from "../store/sessionSlice";
import {FaCrown} from 'react-icons/fa'
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill} from 'react-icons/bs'

const SessionDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    addSessionIdToLocalStorage(id);

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
    const slideAmount = 200;

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

    const highestScore = session?.players.reduce((max, player) => player.score > max ? player.score : max, -Infinity);
    // @ts-ignore
    const secondHighestScore = session?.players.reduce((max, player) => player.score > max && player.score < highestScore ? player.score : max, -Infinity);
    return (
        <MobileLayout>
            {isLoading && <Loading/>}
            <div className="container mt-4">
              <h6 className="text-center mb-4">{getSeasonLabel(session?.season)}</h6>
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
                                    {player.player.firstname + ' ' + player.player.lastname.charAt(0).toUpperCase() + '.'}
                                </div>
                                {
                                    session?.games.length > 0 && (
                                        <div>
                                            {player.score === highestScore && <FaCrown color={'gold'}/>}
                                            {player.score === secondHighestScore && <FaCrown color={'silver'}/>}
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
                    session?.games && session?.games.length > 0 ?
                        (<div className="text-right" style={
                            {marginTop: '-20px'}
                        }>
                            <button type="button" className="btn btn-warning btn-sm" style={{
                                fontSize: '0.7rem',
                            }} onClick={() => {
                                setShowDeleteModal(true);
                            }}>Annuler la dernière partie
                            </button>
                        </div>) : null
                }

                <BootstrapModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <BootstrapModal.Header>
                        <BootstrapModal.Title>Confirmation</BootstrapModal.Title>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body>Êtes-vous sûr de vouloir annuler la dernière partie?</BootstrapModal.Body>
                    <BootstrapModal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={() => setDeleteModalOpen()}>
                            Confirmer
                        </Button>
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
                        content: {height: 'calc(75% - 100px)'}
                    }}
                >
                    <h4>Tableau des scores</h4>

                    <div style={{display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
                        {offset < 0 &&
                            <button className='btn' onClick={handleLeftSlide}><BsFillArrowLeftCircleFill size={20}/>
                            </button>} {/* Left arrow */}

                        <div className="mb-4" style={{overflowX: 'auto', flexGrow: 1}}>
                            <table className="table table-bordered"
                                   style={{transform: `translateX(${offset}px)`, transition: 'transform 0.3s'}}>
                                <thead>
                                <tr>
                                    <th className={'text-center'}>Joueur</th>
                                    {sessionPoints.map((_, index) => (
                                        <th className={'text-center'}
                                            key={index}>{index === 0 ? "Score actuel" : `Partie ${sessionPoints.length - index}`}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {session?.players.map(playerSession => (
                                    <tr key={playerSession.player._id}>
                                        <td className="font-weight-light">{playerSession.player.username}</td>
                                        {sessionPoints.map((pointsForGame, index) => (
                                            <td key={index}>{pointsForGame[playerSession.player.username]}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <button className='btn' onClick={handleRightSlide}><BsFillArrowRightCircleFill size={20}/>
                        </button>
                    </div>
                    {/*place button bottom left*/}
                    <div className={'float-right'}>
                        <button className="btn btn-warning" onClick={() => setModalOpen(false)}>Fermer</button>
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
                            !isModalOpen && (
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
