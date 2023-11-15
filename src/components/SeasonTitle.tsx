import {getSeasonLabel, Season} from "../model/Session";
import React from "react";

const SeasonTitle = (season: Season) => {

    return (
        <h6 className="mb-4 d-flex justify-content-center align-items-center">
            <div>&nbsp;{getSeasonLabel(season)}&nbsp;</div>
        </h6>
    )
}

export default SeasonTitle;