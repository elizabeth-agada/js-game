import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; // Import the Login component
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Router>
    );
}

export default App;
