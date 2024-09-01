import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface LessonNodeData {
  title: string;
  onAdd: (text: string) => void; // Updated to accept a string parameter
}

const LessonNode: React.FC<NodeProps<LessonNodeData>> = ({ data, isConnectable }) => {
  const [inputText, setInputText] = useState('');

  return (
    <div style={{
      padding: '3px',
      border: '1px solid #ddd',
      borderRadius: '3px',
      background: 'white',
      width: '120px', // Reduced width
      fontSize: '12px', // Smaller font size
    }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>{data.title}</div>
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
      <button 
        onClick={() => data.onAdd(inputText)}
        style={{
          marginTop: '5px',
          padding: '2px 5px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '10px', // Smaller font size for button
        }}
      >
        Burrow Deeper!
      </button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default LessonNode;