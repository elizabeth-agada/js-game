import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        if (username && password) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            navigate('/game'); // Redirect to the game page
        } else {
            setErrorMessage('Please enter both username and password.');
        }
    };

    return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Register</h3>
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
                {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
