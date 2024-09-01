import React, { useState } from 'react';
import LessonFlow from './components/LessonFlow';
import './App.css';

const App: React.FC = () => {
  const [nextWarren, setNextWarren] = useState('');
  const [showLessonFlow, setShowLessonFlow] = useState(false);

  const handleEnter = () => {
    if (nextWarren.trim() !== '') {
      setShowLessonFlow(true);
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
    <button onClick={handleEnter} className="enter-button">Enter</button>

      </div>
      {showLessonFlow && <LessonFlow startingWarren={nextWarren} />}
    </div>
  );
};

export default App;