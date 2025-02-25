import React, { useCallback } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Connection, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  XYPosition,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import LessonNode from './LessonNode';
import axios from 'axios';

const nodeTypes = {
  lessonNode: LessonNode,
};

const initialEdges: Edge[] = [];

const LessonFlow: React.FC<{ startingWarren: string, answer: string }> = ({ startingWarren, answer }) => {
    const initialNodes: Node[] = [
        { 
          id: '1', 
          type: 'lessonNode', 
          position: { x: 50, y: 50 }, 
          data: { 
            title: startingWarren,
            answer: answer,
            onAdd: () => {} 
          } 
        },
      ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = useCallback(async (parentId: string, title: string, answer: string) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://rabbit-warren-f52348ca9b76.herokuapp.com';
      const response = await axios.post(`${API_URL}/api/answer`, { question: title });
      const newAnswer = response.data.answer;
      console.log("Adding node with title:", title);
      console.log("Adding node with answer:", answer);

      setNodes((prevNodes) => {
        const newNodeId = (prevNodes.length + 1).toString();
        const parentNode = prevNodes.find(node => node.id === parentId);
        
        if (!parentNode) return prevNodes;

        const newNodePosition: XYPosition = {
          x: parentNode.position.x + 150,
          y: parentNode.position.y + 100, 
        };

        const newNode: Node = {
          id: newNodeId,
          type: 'lessonNode',
          position: newNodePosition,
          data: { 
            title: title || `Lesson ${newNodeId}`,
            answer: newAnswer,
            onAdd: (text: string) => handleAddNode(newNodeId, text, newAnswer),
          },
        };

        setEdges((eds) => [
          ...eds,
          {
            id: `e${parentId}-${newNodeId}`,
            source: parentId,
            target: newNodeId,
            type: 'smoothstep', 
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ]);

        return [...prevNodes, newNode];
      });
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  }, [setNodes, setEdges]);

  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAdd: (text: string) => handleAddNode(node.id, text, node.data.answer),
        },
      }))
    );
  }, [setNodes, handleAddNode]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default LessonFlow;