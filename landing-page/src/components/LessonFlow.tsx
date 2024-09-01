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

const nodeTypes = {
  lessonNode: LessonNode,
};

const initialEdges: Edge[] = [];

const LessonFlow: React.FC<{ startingWarren: string }> = ({ startingWarren }) => {

    const initialNodes: Node[] = [
        { 
          id: '1', 
          type: 'lessonNode', 
          position: { x: 50, y: 50 }, 
          data: { 
            title: startingWarren,
            onAdd: () => {} // This will be replaced when the component mounts
          } 
        },
      ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = useCallback((parentId: string, title: string) => {
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
          title: title || `Lesson ${newNodeId}`, // Use the provided title or fallback
          onAdd: (text: string) => handleAddNode(newNodeId, text),
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
  }, [setNodes, setEdges]);

  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAdd: (text: string) => handleAddNode(node.id, text),
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
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default LessonFlow;