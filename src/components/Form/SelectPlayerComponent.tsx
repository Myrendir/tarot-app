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
    console.log('formdataplayer', formData.players[index]);
    console.log('index', index);
    console.log('selectedPlayer', selectedPlayer)
    const hasSelectedPlayer = formData.players[index] !== null;

    if (hasSelectedPlayer) {
        selectedPlayer = formData.players[index].firstname;
        placeholder = `${formData.players[index].firstname} ${formData.players[index].lastname.charAt(0)}.`;

    }
    return (
        <Select
            key={index}
            name={`player${index}`}
            placeholder={placeholder}
            value={selectOptions.find((option: { value: string | null; }) => option.value === selectedPlayer)}
            options={selectOptions.filter(
                (option: {
                    value: string | null;
                }) => !formData.players.includes(option.value) || option.value === selectedPlayer
            )}
            className="mb-3"
            onChange={(selectedOption: { value: any; }) => {
                const newPlayers = [...formData.players];
                newPlayers[index] = selectedOption?.value;
                setFormData({...formData, players: newPlayers});
            }}
            isClearable={true}
        />
    )
}

export default SelectPlayerComponent;