import {getSeasonLabel, Season} from "../model/Session";
import PumpkinIco from "./Icons/seasons/PumpkinIco";
import FlowerIco from "./Icons/seasons/FlowerIco";
import SunIco from "./Icons/seasons/SunIco";
import React from "react";
import {FaGlobe, FaLeaf, FaSnowflake} from "react-icons/fa";

const SeasonTitle = ({season, isFinal}: { season: Season | null, isFinal: boolean }) => {
    const getSeasonIcon = (season: any) => {
        if (season === null) {
            return <FaGlobe color='var(--Bleu, #054A81)'/>
        }

        if (season?.startsWith('autumn')) {
            return <FaLeaf color="#C78657"/>
        } else if (season?.startsWith('spring')) {
            return <FlowerIco/>
        } else if (season?.startsWith('winter')) {
            return <FaSnowflake color={'#a0e6ec'}/>
        } else if (season?.startsWith('summer')) {
            return <SunIco/>
        }
    }

    const getSeasonTitleLabel = (season: Season | null) => {
        if (season === null) {
            return 'Toutes les saisons'
        }

        return `${isFinal ? 'Finale ' : 'Saison '}${getSeasonLabel(season)}`
    }
    return (
        <div>
            <h6 className="d-flex justify-content-center align-items-center">
                <div>{getSeasonIcon(season)}</div>
                <div style={{
                    marginBottom: '-0.2rem',
                }}>&nbsp;{getSeasonTitleLabel(season)}&nbsp;</div>
                <div>{getSeasonIcon(season)}</div>
            </h6>
        </div>
    )

}

export default SeasonTitle;
