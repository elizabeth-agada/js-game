import React from 'react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const navigate = useNavigate();
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    return (
        <div className="min-h-screen bg-blue-500 flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Leaderboard</h1>
            <table className="w-full max-w-md bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="py-2 px-4 text-left text-white">Username</th>
                        <th className="py-2 px-4 text-left text-white">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {highScores.map((entry, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 text-white">{entry.username}</td>
                            <td className="py-2 px-4 text-white">{entry.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => navigate('/game')}
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
            >
                Back to Game
            </button>
        </div>
    );
};

export default Leaderboard;
