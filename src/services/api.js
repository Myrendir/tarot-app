import axios from 'axios';
import {store} from '../store/index';

const state = store.getState();
const token = state.token.value;

const instance = axios.create({
    baseURL: 'http://192.168.10.126:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
});

export default instance;
