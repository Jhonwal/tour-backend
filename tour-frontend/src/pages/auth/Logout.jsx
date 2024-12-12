import { useEffect } from 'react';
import useApi from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import Loading from '@/services/Loading';
import { getToken } from '@/services/getToken';

const Logout = () => {
    const api = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = getToken();
                if (!token) throw new Error("No token found");

                await api.post('/api/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                localStorage.removeItem('token');
                navigate('/');
            } catch (error) {
                console.log('Logout failed', error);
                if (error.response && error.response.status === 401) {
                    // Handle the case where the token might be invalid or expired
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        handleLogout();
    }, [api, navigate]);

    return (
        <div className="bg-cover bg-center !bg-[url('/images/sahara.webp')]">
            <Loading />
        </div>
    );
};

export default Logout;
