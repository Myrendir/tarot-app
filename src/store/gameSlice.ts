import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GameState {
    games: any[];
    loading: boolean;
    error: string | null;
}

const initialState: GameState = {
    games: [],
    loading: false,
    error: null,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        gamesReceived: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.games = action.payload;
        },
        gameAdded: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.games.push(action.payload);
        },
        gameError: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {startLoading, gamesReceived, gameAdded, gameError} = gameSlice.actions;

export default gameSlice.reducer;
