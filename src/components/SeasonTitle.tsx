import {getSeasonLabel, Season} from "../model/Session";
import SunIco from "./Icons/seasons/SunIco";
import React from "react";
import {FaGlobe, FaLeaf, FaSnowflake} from "react-icons/fa";
import {LuFlower} from "react-icons/lu";

const SeasonTitle = ({season, isFinal}: { season: Season | null, isFinal: boolean }) => {
    const getSeasonIcon = (season: string | null) => {
        const iconMapping: { [key: string]: JSX.Element } = {
            autumn: <FaLeaf color="#C78657" />,
            spring: <LuFlower color="#ff69b4" />,
            winter: <FaSnowflake color="#a0e6ec" />,
            summer: <SunIco />,
        };

        if (season === null) {
            return <FaGlobe color='var(--Bleu, #054A81)' />;
        }

        for (const key in iconMapping) {
            if (season?.startsWith(key)) {
                return iconMapping[key];
            }
        }

        return <FaGlobe color='var(--Bleu, #054A81)' />;
    };

    const getSeasonTitleLabel = (season: Season | null) => {
        if (season === null) {
            return 'Toutes les saisons'
        }

        return `${isFinal ? 'Finale ' : 'Saison '}${getSeasonLabel(season)}`
    }
    return (
        <div>
            <h5 className="d-flex justify-content-center align-items-center">
                <div>{getSeasonIcon(season)}</div>
                <div style={{
                    marginBottom: '-0.2rem',
                }}>&nbsp;{getSeasonTitleLabel(season)}&nbsp;</div>
                <div>{getSeasonIcon(season)}</div>
            </h5>
        </div>
    )

}

export default SeasonTitle;
