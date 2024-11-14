import { useEffect } from 'react';
import useApi from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';

const Logout = () => {
    const api = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem('token');
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
        <div className="bg-cover bg-center bg-[url('/images/dades.webp')]">
            <div className="flex justify-center items-center h-screen bg-white bg-opacity-50">
                <div className="relative">
                    <Loader2Icon className='text-red-700 animate-spin' size={200} />
                    <div className="absolute inset-2 flex justify-center items-center text-red-700 font-bold animate-bounce">
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
