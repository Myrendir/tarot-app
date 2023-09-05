import {useState} from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/tokenSlice';

const API_URL = 'http://localhost:3000/api';

interface LoginResult {
    success: boolean;
    token?: string;
    error?: string;
}

const useLogin = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LoginResult | null>(null);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {username, password});
            const receivedToken = response.data.token;

            dispatch(setToken(receivedToken));

            setResult({
                success: true,
                token: receivedToken,
            });

            localStorage.setItem('Token', response.data.token)
        } catch (error: any) {
            setResult({
                success: false,
                error: error.response?.data?.message || "Une erreur s'est produite lors de la connexion",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, result, login};
};

export default useLogin;
