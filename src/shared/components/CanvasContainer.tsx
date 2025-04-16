import React from 'react';
import { ConnectionMode, NodeTypes, ReactFlow, NodeChange, EdgeChange, Connection, OnNodesChange, OnEdgesChange, OnConnect, OnNodeDrag, OnNodesDelete, OnEdgesDelete } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowState } from '../../features/diagram-editing/hooks/useFlowState';
import { useFlowHandlers } from '../../features/diagram-editing/hooks/useFlowHandlers';
import { FlowControls } from '../../features/diagram-editing/components/FlowControl';
import { nodeTypes } from '../../features/diagram-editing/types/NodeTypes.types';

import RightSidebar from './RightSidebar';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import Header from './Header';

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    undo,
    redo,
    takeSnapshot
  } = useFlowState();

  const { onConnect, onDragOver, onDrop } = useFlowHandlers({
    setNodes,
    setEdges
  });

  const handleNodesChange: OnNodesChange = React.useCallback((changes) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  const handleEdgesChange: OnEdgesChange = React.useCallback((changes) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const handleConnect: OnConnect = React.useCallback((connection) => {
    takeSnapshot();
    onConnect(connection);
  }, [onConnect, takeSnapshot]);

  const handleDrop = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    takeSnapshot();
    const newNode = onDrop(event);
    if (newNode) {
      setNodes(nds => nds.concat(newNode));
    }
  }, [onDrop, setNodes, takeSnapshot]);

  const handleNodeDragStart: OnNodeDrag = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const handleNodesDelete: OnNodesDelete = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const handleEdgesDelete: OnEdgesDelete = React.useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <LeftSidebar />
        <div className='canvas'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            onDragOver={onDragOver}
            onDrop={handleDrop}
            onNodeDragStart={handleNodeDragStart}
            onNodesDelete={handleNodesDelete}
            onEdgesDelete={handleEdgesDelete}
            nodeTypes={nodeTypes as NodeTypes}
            connectionMode={ConnectionMode.Loose}
            proOptions={{ hideAttribution: true }}
            fitView
          >
            <FlowControls />
          </ReactFlow>
        </div>
        <RightSidebar nodes={nodes} setNodes={setNodes} />
      </div>
      <Footer />
    </div>
  );
};

export default Canvas;
