import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post('/api/verify-email', { token });
        console.log("Verification response:", response.data);
        setMessage('Email verified successfully! You can now log in.');
      } catch (error) {
        console.error("Verification failed:", error.response ? error.response.data : error.message);
        setMessage('Verification failed. Please check the link or try again.');
      }
    };
    verifyToken();
  }, [token]);

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
        <p className="text-white mb-4">{message}</p>
        {message.includes('successfully') && (
          <button
            onClick={handleLoginRedirect}
            className="mt-4 py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
