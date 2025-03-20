import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, initialEdges } from '../parser/GenerateNodes'; // Importing initial nodes and edges
import ActorNode from '../shapes/Actor';
import OvalNode from '../shapes/Oval';

export default function CustomNodeFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  
  const nodeTypes = {actor: ActorNode, oval: OvalNode};

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      proOptions={{hideAttribution: true}}
    
    ><MiniMap nodeStrokeWidth={10} /><Background />
        <Controls /></ReactFlow>
  );
}
