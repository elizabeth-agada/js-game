import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import VerifyEmail from './components/VerifyEmail';
import WelcomeMessage from './components/WelcomeMessage';
import UserInfo from './components/UserInfo';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/WelcomeMessage" element={<WelcomeMessage />} />
            </Routes>
        </Router>
    );
};

export default App;
