import React from "react";
import Select from "react-select";

type SelectProps = {
    index: number,
    selectedPlayer: string | null,
    formData: any,
    setFormData: any,
    selectOptions: any,
}

const SelectPlayerComponent = ({index, selectedPlayer, formData, setFormData, selectOptions}: SelectProps) => {
    let placeholder = "Sélectionner un joueur";

    const hasSelectedPlayer = formData.players && formData.players.length > index && formData.players[index] !== null;

    if (hasSelectedPlayer) {
        selectedPlayer = formData.players[index].id ?? formData.players[index]._id;
        const player = selectOptions.find((option: { value: string | null; }) => option.value === selectedPlayer);
        placeholder = player.label
    }

    return (
        <Select
            key={index}
            name={`player${index}`}
            placeholder={placeholder}
            value={selectOptions.find((option: { value: string | null; }) => option.value === selectedPlayer)}
            options={selectOptions.filter(
                (option: { value: string | null; }) =>
                    (!formData.players || formData.players.length === 0 || formData.players.every((p: any) => p === null || p.id !== option.value)) || option.value === selectedPlayer
            )}
            className="mb-3"
            onChange={(selectedOption: { value: any; }) => {
                if (formData.players) {
                    const newPlayers = [...formData.players];
                    newPlayers[index] = selectedOption ? {_id: selectedOption.value} : null;
                    setFormData({...formData, players: newPlayers});
                } else {
                    setFormData({...formData, players: [{_id: selectedOption?.value}]});
                }
            }}
            isClearable={true}
            styles={{container: (base) => ({...base, width: '100%'})}}
        />
    )
}

export default SelectPlayerComponent;
