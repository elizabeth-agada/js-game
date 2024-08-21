import React from 'react';

const WelcomeMessage = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            {user ? (
                <h1 className="text-3xl font-bold text-white mb-6">Welcome, {user.username}!</h1>
            ) : (
                <h1 className="text-3xl font-bold text-white mb-6">Welcome, Guest!</h1>
            )}
        </div>
    );
};

export default WelcomeMessage;
