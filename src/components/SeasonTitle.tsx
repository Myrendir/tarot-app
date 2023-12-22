import {getSeasonLabel, Season} from "../model/Session";
import PumpkinIco from "./Icons/seasons/PumpkinIco";
import FlowerIco from "./Icons/seasons/FlowerIco";
import SunIco from "./Icons/seasons/SunIco";
import React from "react";
import {FaSnowflake} from "react-icons/fa";

const SeasonTitle = ({season}: { season: Season }) => {
    const getSeasonIcon = (season: any) => {
        if (season?.startsWith('autumn')) {
            return <PumpkinIco/>
        } else if (season?.startsWith('spring')) {
            return <FlowerIco/>
        } else if (season?.startsWith('winter')) {
            return <FaSnowflake color={'#a0e6ec'}/>
        } else if (season?.startsWith('summer')) {
            return <SunIco/>
        }
    }

    return (
        <h6 className="mb-4 d-flex justify-content-center align-items-center">
            <div>{getSeasonIcon(season)}</div>
            <div style={{
                marginBottom: '-0.2rem',
            }}>&nbsp;Saison {getSeasonLabel(season)}&nbsp;</div>
            <div>{getSeasonIcon(season)}</div>
        </h6>
    )

}

export default SeasonTitle;
