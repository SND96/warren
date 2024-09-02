import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import StyledButton from './StyledButton';


interface LessonNodeData {
  title: string;
  answer: string;
  onAdd: (text: string) => Promise<void>; // Changed to return a Promise
  isLoading?: boolean; // New property
}

const LessonNode: React.FC<NodeProps<LessonNodeData>> = ({ data, isConnectable }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBurrowDeeper = async () => {
    setIsLoading(true);
    try {
      await data.onAdd(inputText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '3px',
      border: '1px solid #ddd',
      borderRadius: '3px',
      background: 'white',
      width: '400px', // Reduced width
      fontSize: '12px', // Smaller font size
    }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="node-title" style={{
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px',
        padding: '2px 4px',
        backgroundColor: '#f0f0f0',
        borderRadius: '2px'
      }}>{data.title}</div>
      {data.answer && <p className="answer">{data.answer}</p>}

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{
          width: '95%',
          marginTop: '5px',
          padding: '2px',
          border: '1px solid #ddd',
          borderRadius: '2px',
          fontSize: '10px', // Smaller font size for input
        }}
        placeholder="Enter text"
      />
      <StyledButton onClick={handleBurrowDeeper} disabled={isLoading}>
        {isLoading ? 'Rabbits burrowing...' : 'Burrow Deeper!'}
      </StyledButton>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default LessonNode;