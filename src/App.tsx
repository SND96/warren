import React, { useState } from 'react';
import LessonFlow from './components/LessonFlow';
import axios from 'axios';
import './App.css';
import StyledButton from './components/StyledButton';

const App: React.FC = () => {
  const [nextWarren, setNextWarren] = useState('');
  const [showLessonFlow, setShowLessonFlow] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = async () => {
    if (nextWarren.trim() !== '' && !isLoading) {
      setIsLoading(true);
      try {
        console.log('Fetching answer...');
        console.log(nextWarren);
        const API_URL = process.env.REACT_APP_API_URL || 'https://rabbit-warren-f52348ca9b76.herokuapp.com';
        const response = await axios.post(`${API_URL}/api/answer`, { question: nextWarren });
        console.log(response.data.answer);
        setAnswer(response.data.answer);
        setShowLessonFlow(true);
      } catch (error) {
        console.error('Error fetching answer:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="app">
      <h1>Warren</h1>
      <div>
        <input
          type="text"
          value={nextWarren}
          onChange={(e) => setNextWarren(e.target.value)}
          placeholder="What's your next Warren?"
          className="large-input"
        />
        <StyledButton 
          onClick={handleEnter} 
          disabled={isLoading}
          style={{
            marginTop: '5px',
            padding: '2px 5px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            fontSize: '25px',
          }}
        >
          {isLoading ? 'Rabbits working...' : 'Start Burrowing!'}
        </StyledButton>
      </div>
      {showLessonFlow && (
        <>
          <LessonFlow startingWarren={nextWarren} answer={answer} />
        </>
      )}
    </div>
  );
};

export default App;