// src/components/AuthMiddleware.jsx
import { Navigate } from 'react-router-dom';

const AuthMiddleware = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); // Or use any other method to check authentication

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthMiddleware;
