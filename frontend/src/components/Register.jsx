import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (email && username && password) {
            try {
                const response = await axios.post('http://localhost:5001/api/register', { email, username, password });
                setSuccessMessage(response.data.message);
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
                } else {
                    setErrorMessage('Registration failed. Please try again.');
                }
            }
        } else {
            setErrorMessage('Please enter all fields.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Register</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="block w-full mb-4 p-3 rounded border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="block w-full mb-4 p-3 rounded border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="block w-full mb-4 p-3 rounded border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleRegister}
                    className="block w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Register
                </button>
                <button
                    onClick={handleLoginRedirect}
                    className="block w-full mt-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Go to Login
                </button>
                {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
                {successMessage && <p className="text-green-400 mt-2">{successMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
