import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import VerifyEmail from './components/VerifyEmail';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
            </Routes>
        </Router>
    );
};

export default App;
