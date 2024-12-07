// src/components/LoginContext.jsx
import Login from '@/pages/auth/Login';
import { getToken } from '@/services/getToken';
import { Navigate } from 'react-router-dom';

const LoginContext = ({ children }) => {
    const isAuthenticated = getToken(); // Or use any other method to check authentication

    if (isAuthenticated) {
        return <Navigate to="/admin" />;
    }else{
        return <Login/>;
    }

    return children;
};

export default LoginContext;
