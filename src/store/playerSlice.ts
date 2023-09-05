import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
    players: any[];
    loading: boolean;
    error: string | null;
}

const initialState: PlayerState = {
    players: [],
    loading: false,
    error: null,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        startLoadingPlayers: (state) => {
            state.loading = true;
            state.error = null;
        },
        playersReceived: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.players = action.payload;
        },
        playerError: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { startLoadingPlayers, playersReceived, playerError } = playerSlice.actions;

export default playerSlice.reducer;
