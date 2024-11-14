import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../services/api";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            console.log('User added:', response.data);
            navigate('/');
        } catch (err) {
            console.error('Error adding user:', err);
            setError(err.response?.data?.error || 'An error occurred while adding the user.');
        }
    };

    return (
        <>
            <h1 className="title">Register</h1>
            <form onSubmit={handleSubmit} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input 
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password"   
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="password"
                        placeholder="Confirm password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button className="primary-btn">Register</button>
            </form>
        </>
    );
}
