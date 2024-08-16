import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.post('/api/verify-email', { token });
        setMessage('Email verified successfully! You can now log in.');
      } catch (error) {
        setMessage('Verification failed. Please check the link or try again.');
      }
    };
    verifyToken();
  }, [token]);

  return <div>{message}</div>;
}

export default VerifyEmail;
