import React from 'react';
import { jwtDecode } from 'jwt-decode';


const UserInfo = () => {
  const token = localStorage.getItem('token');
  let username = '';

  if (token) {
    const decoded = jwtDecode(token);
    username = decoded.username; // Get the username from the token
  }

  return (
    <div>
      {username ? <p>Welcome, {username}!</p> : <p>Please log in.</p>}
    </div>
  );
};

export default UserInfo;
