import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import MobileLayout from "../../Layout/MobileLayout";
import api from "../../services/api";

import '../podium.css';
import Loading from "../Loading";
import Widget from "../Dashboard/Widget";
import Podium from "../Dashboard/Podium";


const HomePage = () => {
    const [mostGamesTaken, setMostGamesTaken] = useState<any>([]);
    const [mostGamesCalled, setMostGamesCalled] = useState<any>([]);
    const [mostPointsCumulated, setMostPointsCumulated] = useState<any>([]);
    const [topWinrate, setTopWinrate] = useState<any>([]);
    const [topAveragePoints, setTopAveragePoints] = useState<any>([]);
    const [topGWinrate, setTopGWinrate] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/stats/gamesTaken')
            .then(response => {
                setMostGamesTaken(response.data);
            })
            .catch(error => {
                console.error("Error fetching most games taken:", error);
            });

        api.get('/stats/calledPartners')
            .then(response => {
                setMostGamesCalled(response.data);
            })
            .catch(error => {
                console.error("Error fetching most games called:", error);
            });

        api.get('/stats/mostPointsCumulated')
            .then(response => {
                setMostPointsCumulated(response.data);
            }).catch(error => {
            console.error("Error fetching most points cumulated:", error);
        })
        api.get('/stats/topWinrate')
            .then(response => {
                setTopWinrate(response.data);
            }).catch(error => {
            console.error("Error fetching top winrate:", error);
        })
        api.get('/stats/bestAveragePointsPerGame')
            .then(response => {
                setTopAveragePoints(response.data);
            }).catch(error => {
            console.error("Error fetching top average points:", error);
        })
        api.get('/stats/mostWinrateForBet/g')
            .then(response => {
                setTopGWinrate(response.data);
            })
            .catch(error => {
                console.error("Error fetching top g winrate:", error);
            });
        setIsLoading(false);
    }, []);

    return (
        <MobileLayout>
            {
                isLoading ? <Loading/> :
                    <div className="container mt-4">
                        <div className="row">
                            {mostGamesTaken.length > 0 ?
                                <Widget children={<Podium players={mostGamesTaken}
                                                          dataKey={'count'}
                                                          title={'Top preneurs'}/>}
                                        title={'Top preneurs'}/> : null}
                            {mostGamesCalled.length > 0 ?
                                <Widget children={<Podium players={mostGamesCalled}
                                                          dataKey={'count'}
                                                          title={'Top appelés'}/>}
                                        title={'Top appelés'}/> : null}
                            {mostPointsCumulated.length > 0 ?
                                <Widget children={<Podium players={mostPointsCumulated}
                                                          dataKey={'totalPoints'} title={'Top points cumulés'}/>}
                                        title={'Top points cumulés'}/> : null}
                            {topWinrate.length > 0 ?
                                <Widget children={<Podium players={topWinrate}
                                                          dataKey={'winPercentage'}
                                                          title={'Top winrate preneurs'}
                                                          percentage={true}/>}
                                        title={'Top winrate preneurs'}/> : null}
                            {topAveragePoints.length > 0 ?
                                <Widget children={<Podium players={topAveragePoints}
                                                          dataKey={'averagePoints'}
                                                          title={'Top moyenne de points par partie'}/>}
                                        title={'Top moyenne de points par partie'}/> : null}
                            {topGWinrate.length > 0 ?
                                <Widget children={<Podium players={topGWinrate}
                                                          dataKey={'winrate'}
                                                          title={'Top winrate garde'}
                                                          percentage={true}/>}
                                        title={'Top winrate garde'}/> : null}

                        </div>
                        <div className="text-center pb-3">
                            <Link className="btn btn-primary rounded-pill" to={"/session"}>Enregistrer des
                                scores
                            </Link>
                        </div>
                    </div>
            }

        </MobileLayout>
    );
}

export default HomePage;
