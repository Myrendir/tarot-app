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
        setIsLoading(false);
    }, []);

    return (
        <MobileLayout>
            {
                isLoading ? <Loading/> :
                    <div className="container mt-4">
                        <div className="row">
                            {mostGamesTaken.length > 0 ?
                                <Widget children={<Podium players={mostGamesTaken}/>} title={'Top preneurs'}/> : null}
                            {mostGamesCalled.length > 0 ?
                                <Widget children={<Podium players={mostGamesCalled}/>} title={'Top appelés'}/> : null}
                            {mostPointsCumulated.length > 0 ?
                                <Widget children={<Podium players={mostPointsCumulated}/>}
                                        title={'Top points cumulés'}/> : null}
                        </div>
                        <div className="text-center pb-3">
                            <Link className="btn btn-primary rounded-pill" to={"/addSession"}>Enregistrer des
                                scores
                            </Link>
                        </div>
                    </div>
            }

        </MobileLayout>
    );
}

export default HomePage;
