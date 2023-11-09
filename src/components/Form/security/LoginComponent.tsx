import React, {useState} from 'react';
import useLogin from '../../../hooks/useLogin';
import useLogout from '../../../hooks/useLogout';  // Importez le hook useLogout
import {useSelector} from 'react-redux';

const LoginComponent: React.FC = () => {
    // @ts-ignore
    const token = useSelector(state => state.token.value);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {isLoading, result, login} = useLogin();
    const logout = useLogout();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(username, password);
    };

    if (token) {
        return (
            <div>
                <button onClick={logout}>Se déconnecter</button>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isLoading}>Se connecter</button>
            </form>

            {result && result.success && <p>Connecté avec succès !</p>}
            {result && !result.success && <p>Erreur: {result.error}</p>}
        </div>
    );
};

export default LoginComponent;
