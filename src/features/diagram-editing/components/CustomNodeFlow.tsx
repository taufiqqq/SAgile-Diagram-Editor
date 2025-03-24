import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  Controls,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, initialEdges } from '../../parsing/plantuml-use-case/GenerateNodes'; // Importing initial nodes and edges
import ActorNode from '../shapes/Actor';
import OvalNode from '../shapes/Oval';
import { useCallback } from 'react';
import { useDnD } from './DnDContext';

export default function CustomNodeFlow() {
  const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
  const nodeTypes = { actor: ActorNode, oval: OvalNode };

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'straight' }, eds)
      ),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) {
        console.error('No node type found in drag event');
        return;
      }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    
    const adjustedPosition = {
      x: position.x - 75,
      y: position.y - 50,
    };

      const newNode = {
        id: `node_${+new Date()}`,
        type,
        position: adjustedPosition,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <MiniMap nodeStrokeWidth={10} />
      <Background />
      <Controls />
    </ReactFlow>
  );
}
