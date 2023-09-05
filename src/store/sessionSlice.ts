import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import api from "../services/api";
import {SessionPlayer} from "../model/Session";
import React from "react";
import {Session} from "../model/Session";

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

export const addSessionIdToLocalStorage = (sessionId: string | undefined) => {
    const visitedSessions = JSON.parse(localStorage.getItem('visitedSessions') || '[]');

    if (!visitedSessions.includes(sessionId)) {
        visitedSessions.push(sessionId);
        localStorage.setItem('visitedSessions', JSON.stringify(visitedSessions));
    }
}

export const getVisitedSessionIdsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('visitedSessions') || '[]');
}

export const {startLoading, sessionsReceived, sessionAdded, sessionError} = sessionSlice.actions;

export default sessionSlice.reducer;

