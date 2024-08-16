import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (email && password) {
            try {
                const response = await axios.post('http://localhost:5001/api/login', { email, password });

                // Show a success message
                setSuccessMessage(response.data.message);

                // Optionally redirect to another page, like a dashboard
                // navigate('/dashboard'); // Uncomment if you want to redirect to the dashboard page
            } catch (error) {
                if (error.response) {
                    // Backend returned an error response
                    setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
                } else {
                    // Network or other errors
                    setErrorMessage('Login failed. Please try again.');
                }
            }
        } else {
            setErrorMessage('Please enter all fields.');
        }
    };

    const handleRegisterRedirect = () => {
      navigate('/'); // Redirect to the register page
  };

    return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Login</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
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
                    onClick={handleLogin}
                    className="block w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
                <button onClick={handleRegisterRedirect}
                    className="block w-full mt-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2"
                >
                    Register
                </button>
                {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
                {successMessage && <p className="text-green-400 mt-2">{successMessage}</p>}
            </div>
        </div>
    );
};

export default Login;
