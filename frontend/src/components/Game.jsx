import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const levels = {
  easy: 5,
  medium: 3,
  hard: 2,
};

const words = [
  'grid', 'swift', 'rails', 'ruby', 'python', 'java', 'tech', 'clear', 'echo', 'let',
  'wall', 'laughter', 'hash', 'kotlin', 'mobile', 'android', 'javascript', 'web', 'program',
  'coding', 'basic', 'foodie', 'work', 'case', 'react', 'dragon', 'rush', 'api', 'virtual',
  'nerd', 'google', 'float', 'docker', 'block', 'rank', 'class', 'machine', 'perfect',
  'deploy', 'terminal', 'array', 'vue', 'node', 'issue', 'front', 'grid', 'geek', 'mac',
  'console', 'clone', 'heroku', 'slack', 'version', 'control', 'data', 'npm', 'developer',
];

function Game() {
  const [currentLevel, setCurrentLevel] = useState(levels);
  const [time, setTime] = useState(levels.easy);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [message, setMessage] = useState('');
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('highScore')) || 0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const navigate = useNavigate();

  // Function to update high scores
  const updateHighScores = useCallback(() => {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    if (username) {
      const existingUserIndex = highScores.findIndex(entry => entry.username === username);
      if (existingUserIndex >= 0) {
        if (highScores[existingUserIndex].score < score) {
          highScores[existingUserIndex].score = score;
        }
      } else {
        highScores.push({ username, score });
      }

      highScores.sort((a, b) => b.score - a.score);
      localStorage.setItem('highScores', JSON.stringify(highScores));
    }
  }, [score, username]);

  // Function to end the game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setMessage('Game Over!');
    setFinalScore(score);
    updateHighScores(); // Call to update high scores
    setShowGameOverModal(true);
  }, [score, updateHighScores]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlaying, endGame]);

  useEffect(() => {
    generateWord();
  }, [currentLevel]);

  function generateWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
  }

  function checkWord() {
    if (wordInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(prevScore => prevScore + 1);
      setWordInput('');
      generateWord(); // Generate a new word immediately
      setTime(currentLevel); // Reset the timer
      setMessage('Good Job!');

      // Update high score if necessary
      if (score + 1 > highScore) {
        localStorage.setItem('highScore', score + 1);
        setHighScore(score + 1);
      }
    }
  }

  function setLevel(level) {
    setCurrentLevel(levels[level]);
    setTime(levels[level]);
    setScore(0);
    setIsPlaying(true);
  }

  function startAgain() {
    setShowGameOverModal(false);
    setLevel('');
  }

  function closeGameOverModal() {
    setShowGameOverModal(false);
    navigate('/leaderboard');
  }

  // Logout function
  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('highScore');
    setUsername('');
    setHighScore(0);
    setIsPlaying(false);
    setScore(0);
    setMessage('You have been logged out.');
    navigate('/'); // Navigate to login page
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 text-white p-6">
      <header className="text-center mb-6">
        <div id="username-display" className="text-xl font-semibold mb-4">
          {username ? `Welcome, ${username}!` : 'Welcome, Guest!'}
        </div>
        <div id="level" className="text-lg">
          <h2 className="text-lg font-bold text-red-900">Select a Level to begin</h2>
          Current Level: <span id="current-level" className="font-bold">{Object.keys(levels).find(key => levels[key] === currentLevel)}</span>
        </div>
      </header>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setLevel('easy')} className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded">Easy 🐷</button>
        <button onClick={() => setLevel('medium')} className="bg-yellow-500 hover:bg-yellow-400 text-white py-2 px-4 rounded">Medium 🐼</button>
        <button onClick={() => setLevel('hard')} className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded">Hard 🦁</button>
      </div>
      <div className="text-lg mb-4">
        Time Left: <span id="time-left" className="font-bold">{time}s</span>
      </div>
      <div className="text-2xl mb-4">
        Word: <span id="word" className="font-bold">{currentWord}</span>
      </div>
      <input
        type="text"
        value={wordInput}
        onChange={(e) => {
          setWordInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            checkWord(); // Call checkWord on Enter key press
          }
        }}
        placeholder="Type the word..."
        className="block w-full max-w-xs p-3 rounded border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!isPlaying}
      />
      <div className="text-xl mt-4">Score: {score}</div>
      {message && <div className="text-lg mt-4">{message}</div>}
      {showGameOverModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
            <p className="text-lg mb-4">Your Final Score: {finalScore}</p>
            <button
              onClick={startAgain}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded mr-2"
            >
              Play Again
            </button>
            <button
              onClick={closeGameOverModal}
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded"
            >
              Go to Leaderboard
            </button>
          </div>
        </div>
      )}
      {/* Logout Button at the bottom */}
      {username && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded mt-4 self-center"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Game;
