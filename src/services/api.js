import axios from 'axios';
import {store} from '../store/index';

const state = store.getState();
const token = state.token.value;

const baseURL = process.env.REACT_APP_API_URL;
const instance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error && error.response && error.response.status === 404) {
            return error.response;
        }
    }
);

export default instance;
