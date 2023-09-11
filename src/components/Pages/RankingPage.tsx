import MobileLayout from "../../Layout/MobileLayout";
import React, {useEffect, useState} from "react";
import SelectPlayerComponent from "../Form/SelectPlayerComponent";
import api from "../../services/api";

const RankingPage = () => {
    const [players, setPlayers] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);


    useEffect(() => {
        setIsLoading(true);
        api.get('/player/')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error("Error fetching players:", error);
            });
        setIsLoading(false);
    }, []);

    console.log(players);
    return (
        <MobileLayout>
            <div className="container mt-4">
                <h1 className="text-center mb-4">Classements</h1>
                        <SelectPlayerComponent
                            key={1}
                            index={1}
                            selectedPlayer={selectedPlayer}
                            formData={players}
                            setFormData={setPlayers}
                            selectOptions={players}
                        />
                    ))

            </div>
        </MobileLayout>
    )
}

export default RankingPage;