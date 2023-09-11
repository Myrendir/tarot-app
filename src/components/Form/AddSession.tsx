import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    sessionAdded,
    startLoading,
    sessionError,
    getVisitedSessionIdsFromLocalStorage,
} from '../../store/sessionSlice';
import {RootState} from "../../store";
import {playerError, playersReceived, startLoadingPlayers} from "../../store/playerSlice";
import api from "../../services/api";
import Select from "react-select";
import {Link, useNavigate} from 'react-router-dom';
import MobileLayout from "../../Layout/MobileLayout";
import {toastr} from "react-redux-toastr";
import {Session, SessionPlayer} from "../../model/Session";
import Loading from "../Loading";
import SelectPlayerComponent from "./SelectPlayerComponent";

const AddSession: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        games: [],
        players: Array(5).fill(null),
    });
    const ids = getVisitedSessionIdsFromLocalStorage();

    const [foundSessionId, setFoundSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessions, setSessions] = useState<Session[]>([]);
    const getVisitedSession = async () => {
        let localSessions = [...sessions];

        const fetchSessionPromises = ids.map(async (id: string) => {
            if (!localSessions.find((s: Session) => s._id === id)) {
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
                    };

                    if (localSessions.find((s: Session) => s._id === completeSessionData._id)) {
                        localSessions = [...localSessions.filter((s: Session) => s._id !== completeSessionData._id), completeSessionData];
                    } else {
                        localSessions = [...localSessions, completeSessionData];
                    }

                } catch (error: any) {
                    dispatch(sessionError(error.message));
                }
            }
        });

        await Promise.all(fetchSessionPromises);

        setSessions(localSessions);
        setIsLoading(false);
    }


    useEffect(() => {
        getVisitedSession();
        // eslint-disable-next-line
    }, []);

    const getSessionResume = (session: Session) => {

        const players = session.players.map((p: SessionPlayer) => p.player.firstname + ' ' + p.player.lastname.charAt(0).toUpperCase()).join(', ');
        const games = `${session.games.length} ${session.games.length > 1 ? 'parties' : 'partie'}`;
        return (
            <div>
                <i className='fa fa-arrow-right'></i> Avec {players} en {games}
            </div>
        );

    }

    const players = useSelector((state: RootState) => state.player.players);
    useEffect(() => {
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

        fetchPlayers();
    }, [dispatch]);

    useEffect(() => {
        const checkExistingSession = async () => {
            try {
                const response = await api.get('/session/check', {
                    params: {
                        players: formData.players.filter(p => p !== null),
                    },
                });

                if (response.status === 200 && response.data.sessionId) {
                    setFoundSessionId(response.data.sessionId);
                } else {
                    setFoundSessionId(null);
                }
            } catch (error) {
                console.error("Error checking for existing session:", error);
            }
        };

        if (formData.players.every(p => p !== null)) {
            checkExistingSession();
        } else {
            setFoundSessionId(null);
        }
    }, [formData.players]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // check if there is 5 players
        if (formData.players.filter(p => p !== null).length < 5) {
            toastr.error('Erreur', 'Il faut 5 joueurs pour créer une session.');
        }


        if (foundSessionId) {
            window.location.href = `/session/${foundSessionId}`;
            return;
        }

        try {
            dispatch(startLoading());

            const response = await api.post('/session',
                JSON.stringify(formData),
            );

            const data = await response;

            dispatch(sessionAdded(data));

            navigate(`/session/${data.data._id}`);
        } catch (error: any) {
            dispatch(sessionError(error.message));
        }
    };

    const selectOptions = players.map(player => ({
        value: player._id,
        label: `${player.firstname} ${player.lastname.charAt(0)}.`,
    }));

    return (
        <MobileLayout>
            {
                isLoading ? <Loading/> : ''
            }
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
                            foundSessionId ? <div>
                                    <Link className="btn btn-warning rounded-pill text-white"
                                          to={`/session/${foundSessionId}`}>Utiliser la session existante</Link>
                                </div> :
                                <button type="submit"
                                        disabled={foundSessionId !== null}
                                        className="btn btn-primary rounded-pill">Ajouter la
                                    session
                                </button>
                        }
                    </div>
                </form>
                {
                    ids.length > 0 &&
                    <div className="mt-4">
                        <h4 className="text-center mb-4">Sessions récemment consultées</h4>
                        <div className="list-group">
                            {
                                sessions.map((session: Session) => (
                                    <Link key={session._id}
                                          to={`/session/${session._id}`}
                                          className="list-group-item list-group-item-action mb-2 rounded">
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
