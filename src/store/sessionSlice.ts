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

/**
 * Add a session id to the local storage so that it can be used to display the 5 last visited sessions
 * @param sessionId
 */
export const addSessionIdToLocalStorage = (sessionId: string | undefined) => {
    if (!sessionId) return;

    const visitedSessions = JSON.parse(localStorage.getItem('visitedSessions') || '[]');

    const index = visitedSessions.indexOf(sessionId);
    if (index !== -1) {
        visitedSessions.splice(index, 1);
    }

    visitedSessions.unshift(sessionId);

    while (visitedSessions.length > 5) {
        visitedSessions.pop();
    }

    localStorage.setItem('visitedSessions', JSON.stringify(visitedSessions));
}

/**
 * Remove a session id from the local storage
 * @param sessionId
 */
export const removeSessionIdFromLocalStorage = (sessionId: string | undefined) => {
    const visitedSessions = JSON.parse(localStorage.getItem('visitedSessions') || '[]');

    if (visitedSessions.includes(sessionId)) {
        const index = visitedSessions.indexOf(sessionId);
        visitedSessions.splice(index, 1);
        localStorage.setItem('visitedSessions', JSON.stringify(visitedSessions));
    }
}

export const getVisitedSessionIdsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('visitedSessions') || '[]');
}

export const {startLoading, sessionAdded, sessionError} = sessionSlice.actions;

export default sessionSlice.reducer;

