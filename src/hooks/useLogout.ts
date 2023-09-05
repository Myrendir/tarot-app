import {useDispatch} from 'react-redux';
import {clearToken} from '../store/tokenSlice';

const useLogout = () => {
    const dispatch = useDispatch();

    return () => {
        localStorage.removeItem('Token');
        dispatch(clearToken());
    };
};

export default useLogout;
