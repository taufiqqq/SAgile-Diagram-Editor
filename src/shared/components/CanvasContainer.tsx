import React from "react";
import {
  ConnectionMode,
  NodeTypes,
  ReactFlow,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnNodeDrag,
  OnNodesDelete,
  OnEdgesDelete,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowState } from "../../features/diagram-editing/hooks/useFlowState";
import { useFlowHandlers } from "../../features/diagram-editing/hooks/useFlowHandlers";
import { FlowControls } from "../../features/diagram-editing/components/FlowControl";
import {
  nodeTypes,
  ShapeNode,
} from "../../features/diagram-editing/types/NodeTypes.types";
import { edgeTypes } from "../../features/diagram-editing/types/EdgeTypes.types";

import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import LeftSidebar from "./LeftSidebar";
import Header from "./Header";

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    takeSnapshot,
  } = useFlowState();

  const { onConnect, onDragOver, onDrop } = useFlowHandlers({
    setNodes: setNodes as (nodes: ShapeNode[]) => void,
    setEdges: setEdges as (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  });

  const handleNodesChange: OnNodesChange = React.useCallback(
    (changes) => {
      onNodesChange(changes as NodeChange<ShapeNode>[]);
    },
    [onNodesChange]
  );

  const handleEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => {
      onEdgesChange(changes as EdgeChange<Edge>[]);
    },
    [onEdgesChange]
  );

  const handleConnect: OnConnect = React.useCallback(
    (connection) => {
      takeSnapshot();
      onConnect(connection);
    },
    [onConnect, takeSnapshot]
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      takeSnapshot();
      const newNode = onDrop(event);
      if (newNode) {
        setNodes((nds: ShapeNode[]) => [...nds, newNode]);
      }
    },
    [onDrop, setNodes, takeSnapshot]
  );

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
        <div className="canvas">
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
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            proOptions={{ hideAttribution: true }}
            fitView
          >
            <FlowControls />
          </ReactFlow>
        </div>
        <RightSidebar 
          nodes={nodes} 
          setNodes={setNodes as (nodes: ShapeNode[] | ((nodes: ShapeNode[]) => ShapeNode[])) => void} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default Canvas;
