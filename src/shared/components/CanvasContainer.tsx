import React, { useEffect } from "react";
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
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowState } from "../../features/diagram-editing/hooks/useFlowState";
import { useFlowHandlers } from "../../features/diagram-editing/hooks/useFlowHandlers";
import { FlowControls } from "../../features/diagram-editing/components/FlowControl";
import {
  diagramElementTypes,
  DiagramElementNode,
} from "../../features/diagram-editing/types/DiagramElementType.types";
import { edgeTypes } from "../../features/diagram-editing/types/EdgeTypes.types";
import { useParams } from "react-router-dom";
import {
  fetchDiagramData,
  saveDiagramData,
} from "../../features/diagram-editing/services/diagramApiService";
import { toast } from "react-toastify";

import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import LeftSidebar from "./LeftSidebar";
import Header from "./Header";

const Canvas: React.FC = () => {
  const { projectId, sprintId } = useParams<{
    projectId: string;
    sprintId: string;
  }>();
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
    setNodes: setNodes as (nodes: DiagramElementNode[]) => void,
    setEdges: setEdges as (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  });

  useEffect(() => {
    const loadDiagramData = async () => {
      if (!projectId || !sprintId) {
        toast.error('Project ID and Sprint ID are required');
        return;
      }
  
      try {
        const diagramData = await fetchDiagramData(projectId, sprintId);
  
        if (diagramData) {
          setNodes(diagramData.nodes);
          setEdges(diagramData.edges);
        } else {
          toast.info('No diagram found. Starting with an empty diagram.');
        }
      } catch (err) {
        console.error('Error loading diagram:', err);
        toast.error('Failed to load diagram data');
      }
    };
  
    loadDiagramData();
  }, [projectId, sprintId, setNodes, setEdges]);

  // Save diagram data when changes are made
  useEffect(() => {
    const saveDiagram = async () => {
      if (!projectId || !sprintId) return;
  
      toast.info('Saving diagram data...');
      try {
        await saveDiagramData(projectId, sprintId, nodes, edges, true);
      } catch (err) {
        console.error('Error saving diagram:', err);
        toast.error('Failed to save diagram data');
      }
    };
  
    // Debounce the save operation
    const timeoutId = setTimeout(saveDiagram, 1000);
    return () => clearTimeout(timeoutId);
  }, [projectId, sprintId, nodes, edges]);

  const handleNodesChange: OnNodesChange = React.useCallback(
    (changes) => {
      onNodesChange(changes as NodeChange<DiagramElementNode>[]);
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
        setNodes((nds: DiagramElementNode[]) => [...nds, newNode]);
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
    <div
      className="app"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div
        className="main-content"
        style={{ flex: 1, position: "relative", minHeight: 0 }}
      >
        <LeftSidebar />
        <div
          className="canvas"
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
            minWidth: 0,
          }}
        >
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
            nodeTypes={diagramElementTypes as NodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            proOptions={{ hideAttribution: true }}
            fitView
            style={{ width: "100%", height: "100%" }}
          >
            <FlowControls />
          </ReactFlow>
        </div>
        <RightSidebar
          nodes={nodes}
          setNodes={
            setNodes as (
              nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])
            ) => void
          }
        />
      </div>
      <Footer />
    </div>
  );
};

export default Canvas;
