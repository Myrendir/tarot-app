import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {sessionAdded, sessionError, startLoading,} from '../../store/sessionSlice';
import {RootState} from "../../store";
import {playerError, playersReceived, startLoadingPlayers} from "../../store/playerSlice";
import api from "../../services/api";
import {Link, useNavigate} from 'react-router-dom';
import MobileLayout from "../../Layout/MobileLayout";
import {toastr} from "react-redux-toastr";
import {Session, SessionPlayer} from "../../model/Session";
import Loading from "../Loading";
import SelectPlayerComponent from "./SelectPlayerComponent";
import {getPlayerFullname} from "../../model/Player";

const AddSession: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        games: [],
        players: Array(5).fill(null),
    });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [hasExistingSession, setHasExistingSession] = useState<boolean>(false);
    const [sessions, setSessions] = useState<Session[]>([]);

    const [sessionFound, setSessionFound] = useState<string>('');
    const fetchPlayers = async () => {
        try {
            dispatch(startLoadingPlayers());

            const response = await api.get('/player/');

            if (response.status !== 200) {
                throw new Error(response.data.message);
            }

            dispatch(playersReceived(response.data));
        } catch (error: any) {
            dispatch(playerError(error.message));
        }
    };

    useEffect(() => {
        fetchPlayers();
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        const checkExistingSession = async () => {
            try {
                const selectedPlayers = formData.players.filter(p => p !== null);

                if (selectedPlayers.length === 5) {
                    const response = await api.get('/session/check', {
                        params: {
                            players: selectedPlayers,
                        },
                    });

                    if (response.status === 200 && response.data.sessionId) {
                        setHasExistingSession(true);
                        setSessionFound(response.data.sessionId);
                    } else {
                        setHasExistingSession(false);
                        setSessionFound('')
                    }
                } else {
                    setHasExistingSession(false);
                }
            } catch (error) {
                console.error("Error checking for existing session:", error);
            }
        };

        checkExistingSession();
    }, [formData.players]);

    const players = useSelector((state: RootState) => state.player.players);

    const selectOptions = useMemo(() => {
        return players.map(player => ({
            value: player._id,
            label: `${player.firstname} ${player.lastname.charAt(0)}.`,
        }));
    }, [players])


    const getVisitedSessions = async () => {

        setIsLoadingData(true);
        try {
            const response = await api.get('/session/latest');
            const sessionData = response.data;
            const fullSessions = await Promise.all(sessionData.map(async (session: any) => {
                const playerDetailsPromises = session.players.map((p: {
                    player: string
                }) => api.get('/player/' + p.player));
                const playersDetails = await Promise.all(playerDetailsPromises);

                return {
                    ...session,
                    players: session.players.map((p: SessionPlayer, index: number) => ({
                        ...p,
                        player: playersDetails[index].data.data
                    })),
                    games: session.games,
                };
            }));

            setSessions(fullSessions);
            setIsLoadingData(false);
        } catch (error) {
            console.error("Error fetching latest sessions:", error);
        }
    };

    useEffect(() => {
        getVisitedSessions();
    }, []);

    const getSessionResume = (session: Session) => {
        const players = session.players.map((p: SessionPlayer) => getPlayerFullname(p.player)).join(', ');
        return (
            <div className="d-flex justify-content-between">
                <div className="p-2">{players}</div>
                <div className="align-items-center p-3" style={{
                    backgroundColor: 'var(--Bleu, #054A81)',
                    borderRadius: '0 15px 15px 0',
                }}>
                    <i className="fa fa-chevron-right text-white"></i>
                </div>
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.players.filter(p => p !== null).length < 5) {
            toastr.error('Erreur', 'Il faut 5 joueurs pour créer une session.');
            return;
        }

        if (hasExistingSession) {
            window.location.href = `/session/${formData.players.map((p: any) => p._id).join(',')}`;
            return;
        }

        try {
            dispatch(startLoading());

            const data = await api.post('/session', JSON.stringify(formData));

            dispatch(sessionAdded(data));

            navigate(`/session/${data.data._id}`);
        } catch (error: any) {
            dispatch(sessionError(error.message));
        }
    };

    return (
        <MobileLayout>
            {isLoadingData ? <Loading/> : ''}
            <div className='container mt-4'>
                <h1 className="text-center mb-4">Choix de la session</h1>
                <form onSubmit={handleSubmit}>
                    {formData.players.map((selectedPlayer, index: number) => (
                        <SelectPlayerComponent
                            key={index}
                            index={index}
                            selectedPlayer={selectedPlayer}
                            formData={formData}
                            setFormData={setFormData}
                            selectOptions={selectOptions}
                        />
                    ))}

                    <div className="d-flex justify-content-center pt-3">
                        {
                            hasExistingSession ? <div>
                                    <Link className="btn btn-warning rounded-pill text-white"
                                          to={`/session/${sessionFound}`}>Utiliser la
                                        session existante</Link>
                                </div> :
                                <button type="submit"
                                        disabled={hasExistingSession}
                                        className="btn text-white rounded-pill"
                                        style={{
                                            borderColor: 'var(--Bleu, #054A81)',
                                            backgroundColor: 'var(--Bleu, #054A81)',
                                        }}>Ajouter la
                                    session
                                </button>
                        }
                    </div>
                </form>
                {
                    sessions.length > 0 &&
                    <div className="mt-4">
                        <h4 className="text-center mb-4">Sessions récentes</h4>
                        <div className="list-group">
                            {
                                sessions.map((session: Session) => (
                                    <Link key={session._id}
                                          to={`/session/${session._id}`}
                                          className="card border mb-2" style={{
                                        borderRadius: '15px',
                                        color: 'var(--Bleu, #054A81)',
                                    }}>
                                        {getSessionResume(session)}
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                }

            </div>
        </MobileLayout>
    );
};

export default AddSession;