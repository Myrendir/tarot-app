import React from "react";
import Select from "react-select";

type SelectProps = {
    index: number,
    selectedPlayer: string | null,
    formData: any,
    setFormData: any,
    selectOptions: any
}
const SelectPlayerComponent = ({index, selectedPlayer, formData, setFormData, selectOptions}: SelectProps) => {
    return (
        <Select
            key={index}
            name={`player${index}`}
            placeholder={"Sélectionner un joueur"}
            value={selectOptions.find((option: { value: string | null; }) => option.value === selectedPlayer)}
            options={selectOptions.filter(
                (option: { value: string | null; }) => !formData.players.includes(option.value) || option.value === selectedPlayer
            )}
            className="mb-3"
            onChange={(selectedOption: { value: any; }) => {
                const newPlayers = [...formData.players];
                newPlayers[index] = selectedOption?.value;
                setFormData({...formData, players: newPlayers});
            }}
        />
    )
}

export default SelectPlayerComponent;