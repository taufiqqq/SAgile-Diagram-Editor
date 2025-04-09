import React from 'react';
import { ConnectionMode, ReactFlow } from '@xyflow/react';
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
    cut,
    copy,
    paste,
    bufferedNodes
  } = useFlowState();

  const { onConnect, onDragOver, onDrop } = useFlowHandlers({
    setNodes,
    setEdges
  });

  //TODO: recheck issit correct to put in this file or better in other file
  const canCopy = nodes.some(({ selected }) => selected);
  const canPaste = bufferedNodes.length > 0;

  return (
    <div className="app">
          <Header />
          <div className="main-content">
            <LeftSidebar />
            <div className='canvas'>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={(event) => {
                  const newNode = onDrop(event);
                  if (newNode) {
                    setNodes(nds => nds.concat(newNode));
                  }
                }}
                nodeTypes={nodeTypes}
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
