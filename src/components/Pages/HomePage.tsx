import React, {useEffect, useState} from "react";
import MobileLayout from "../../Layout/MobileLayout";
import api from "../../services/api";

import Loading from "../Loading";
import Widget from "../Dashboard/Widget";
import Podium from "../Dashboard/Podium";
import {getSeason, isLastDayOfSeason, Season} from "../../model/Session";
import SeasonTitle from "../SeasonTitle";


const HomePage = () => {
    const [mostGamesTaken, setMostGamesTaken] = useState<any>([]);
    const [mostGamesCalled, setMostGamesCalled] = useState<any>([]);
    const [mostPointsCumulated, setMostPointsCumulated] = useState<any>([]);
    const [topWinrate, setTopWinrate] = useState<any>([]);
    const [topStarred, setTopStarred] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinal, setIsFinal] = useState(isLastDayOfSeason(new Date()));

    const currentSeason = getSeason(new Date());

    useEffect(() => {
        setIsLoading(true);
        api.get('/stats/gamesTaken/' + currentSeason + (isFinal ? '?event=final' : ''))
            .then(response => {
                setMostGamesTaken(response.data);
            })
            .catch(error => {
                console.error("Error fetching most games taken:", error);
            });

        api.get('/stats/calledPartners/' + currentSeason + (isFinal ? '?event=final' : ''))
            .then(response => {
                setMostGamesCalled(response.data);
            })
            .catch(error => {
                console.error("Error fetching most games called:", error);
            });

        api.get('/stats/mostPointsCumulated/' + currentSeason + (isFinal ? '?event=final' : ''))
            .then(response => {
                setMostPointsCumulated(response.data);
            }).catch(error => {
            console.error("Error fetching most points cumulated:", error);
        })
        api.get('/stats/topWinrate/' + currentSeason + (isFinal ? '?event=final' : ''))
            .then(response => {
                setTopWinrate(response.data);
            }).catch(error => {
            console.error("Error fetching top winrate:", error);
        })
        api.get('/stats/topStarred/' + (isFinal ? '?event=final' : ''))
            .then(response => {
                setTopStarred(response.data);
            })
            .catch(error => {
                console.error("Error fetching top starred:", error);
            });
        setIsLoading(false);
    }, [currentSeason, isFinal]);

    return (
        <MobileLayout>
            {
                isLoading ? <Loading/> :
                    <div className="container mt-4">
                        <div className="d-flex justify-content-center">
                            {
                                isFinal ? <button type={"button"}
                                                  className={"btn text-white mb-3"}
                                                  style={{backgroundColor: 'var(--Bleu, #054A81)'}}
                                                  onClick={() => {
                                                      setIsFinal(false);
                                                  }}>
                                        Finale
                                    </button>
                                    :
                                    <div onClick={() => {
                                        setIsFinal(true);
                                    }}>
                                        <SeasonTitle season={currentSeason as Season}/>
                                    </div>
                            }
                        </div>
                        <div className="row">
                            {
                                mostPointsCumulated.length > 2 ?
                                    <Widget children={<Podium players={mostPointsCumulated}
                                                              dataKey={'totalPoints'}
                                                              title={'Top points cumulés'}
                                                              color={'var(--Bleu, #054A81)'}/>}
                                            title={'Top points cumulés'} color={'var(--Bleu, #054A81)'}/> : null
                            }

                            {
                                topStarred.length > 2 ?
                                    <Widget children={<Podium players={topStarred}
                                                              dataKey={'starsCount'}
                                                              title={'Top étoilés'}
                                                              color={'var(--Vert, #48972C)'}
                                    />}
                                            title={'Top étoilés'} color={'var(--Vert, #48972C)'}/> : null
                            }
                            {mostGamesTaken.length > 2 ?
                                <Widget children={<Podium players={mostGamesTaken}
                                                          dataKey={'count'}
                                                          title={'Top preneurs'}
                                                          color={'var(--Rose, #E48F8A)'}/>}
                                        title={'Top preneurs'} color={'var(--Rose, #E48F8A)'}/> : null}
                            {mostGamesCalled.length > 2 ?
                                <Widget children={<Podium players={mostGamesCalled}
                                                          dataKey={'count'}
                                                          title={'Top appelés'} color={'var(--Bleu-clair, #7FBCBD)'}/>}
                                        title={'Top appelés'} color={'var(--Bleu-clair, #7FBCBD)'}/> : null}
                            {topWinrate.length > 2 ?
                                <Widget children={<Podium players={topWinrate}
                                                          dataKey={'winPercentage'}
                                                          title={'Top winrate preneurs'}
                                                          percentage={true} color={'var(--Orange, #E55D35)'}/>}
                                        title={'Top winrate preneurs'} color={'var(--Orange, #E55D35)'}/> : null}


                        </div>
                    </div>
            }

        </MobileLayout>
    );
}

export default HomePage;
