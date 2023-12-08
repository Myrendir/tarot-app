import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SessionState {
    sessions: any[];
    loading: boolean;
    error: string | null;
}

const initialState: SessionState = {
    sessions: [],
    loading: false,
    error: null,
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        sessionsReceived: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.sessions = action.payload;
        },
        sessionAdded: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.sessions.push(action.payload);
        },
        sessionError: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {startLoading, sessionAdded, sessionError} = sessionSlice.actions;

export default sessionSlice.reducer;

