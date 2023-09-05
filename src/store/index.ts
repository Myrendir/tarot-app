import {configureStore} from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import gameReducer from './gameSlice';
import sessionReducer from './sessionSlice';
import playerReducer from './playerSlice';
import {reducer as toastrReducer} from "react-redux-toastr";

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        game: gameReducer,
        session: sessionReducer,
        player: playerReducer,
        toastr: toastrReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
