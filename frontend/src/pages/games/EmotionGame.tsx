import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmotionGame: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'running'>('idle');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes default
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            setGameStatus('idle');
            setTimeLeft(120); // reset timer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = async () => {
    try {
      setError(null);
      setIsRunning(true);
      setGameStatus('running');

      const response = await fetch("http://127.0.0.1:5003/start-emotion", {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to start emotion detection.");
      }

      console.log(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting detection");
      setIsRunning(false);
      setGameStatus('idle');
      setTimeLeft(120);
    }
  };

  useEffect(() => {
    if (location.state?.autoStart) {
      startGame();
    }
  }, [location.state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">😊 Emotion Detection Game</h1>
      <p className="text-gray-600 mb-4">Test your ability to recognize emotional expressions through facial cues!</p>

      <div className="text-sm text-gray-500 mb-6">
        <p><strong>Age Range:</strong> 5–15 years</p>
        <p><strong>Duration:</strong> 2–3 minutes</p>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex justify-center gap-4 mb-4">
        {!isRunning ? (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        ) : (
          <p className="text-green-600 text-lg">Playing... ⏱ {formatTime(timeLeft)} left</p>
        )}

        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p>Webcam will open for emotion detection. Press <strong>Q</strong> to close early.</p>
        <p className="mt-2">Try to show different facial expressions (happy, sad, surprised, etc.)</p>
      </div>
    </div>
  );
};

export default EmotionGame;
