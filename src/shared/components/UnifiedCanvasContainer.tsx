import React, { useEffect, useCallback, useState } from "react";
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
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowState } from "../../features/diagram-editing/hooks/useFlowState";
import { useSequenceFlowState } from "../../features/sequence-diagram-editing/hooks/useSequenceFlowState";
import { useFlowHandlers } from "../../features/diagram-editing/hooks/useFlowHandlers";
import { useEdgeConnection } from "../../features/diagram-editing/hooks/useEdgeConnection";
import { FlowControls } from "../../features/diagram-editing/components/FlowControl";
import {
  diagramElementTypes,
  DiagramElementNode,
} from "../../features/diagram-editing/types/DiagramElementType.types";
import { edgeTypes } from "../../features/diagram-editing/types/EdgeTypes.types";
import { sequenceNodeTypes } from "../../features/sequence-diagram-editing/types/SequenceNodeTypes";
import { sequenceEdgeTypes } from "../../features/sequence-diagram-editing/types/SequenceEdgeTypes";
import { useParams } from "react-router-dom";
import {
  fetchDiagramData,
  saveDiagramData,
} from "../../features/diagram-editing/services/diagramApiService";
import { toast } from "react-toastify";
import { toPng } from 'html-to-image';
import { DiagramType } from "../models/Diagram";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import LeftSidebar from "./LeftSidebar";
import Header from "./Header";
import { useEdgeType } from "../../features/diagram-editing/hooks/useEdgeType";
import { ConnectionRulesHelper } from "../../features/sequence-diagram-editing/components/ConnectionRulesHelper";

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'diagram.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

interface UnifiedCanvasContainerProps {
  diagramType?: DiagramType;
}

const UnifiedCanvasContainer: React.FC<UnifiedCanvasContainerProps> = ({
  diagramType = 'usecase'
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [currentDiagramType, setCurrentDiagramType] = useState<DiagramType>(diagramType);

  // Use case diagram state
  const useCaseFlow = useFlowState();

  // Sequence diagram state
  const sequenceFlow = useSequenceFlowState();

  // Select the appropriate flow state based on diagram type
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    takeSnapshot,
  } = currentDiagramType === 'sequence' ? sequenceFlow : useCaseFlow;

  const { getNodes, screenToFlowPosition } = useReactFlow();

  const handleExportImage = useCallback(() => {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.x + nodesBounds.width;
    const imageHeight = nodesBounds.y + nodesBounds.height;

    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 20);

    const reactFlowWrapper = document.querySelector('.react-flow__viewport');

    if (reactFlowWrapper instanceof HTMLElement) {
      toPng(reactFlowWrapper, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
        pixelRatio: 3,
      }).then(downloadImage);
    } else {
      console.error('React Flow viewport element not found or is not an HTMLElement.');
    }
  }, [getNodes]);

  // Use case specific handlers
  const { onConnect: baseOnConnect, onDragOver, onDrop } = useFlowHandlers({
    setNodes: setNodes as (nodes: DiagramElementNode[]) => void,
    setEdges: setEdges as (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  });

  const { onConnect: enhancedOnConnect } = useEdgeConnection(baseOnConnect);
  const { selectedEdgeType } = useEdgeType();

  const deleteNode = useCallback((nodeId: string) => {
    if (takeSnapshot) takeSnapshot();
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges, takeSnapshot]);

  // Load diagram data
  useEffect(() => {
    const loadDiagramData = async () => {
      if (!projectId) {
        toast.error('Project ID is required');
        return;
      }

      try {
        const diagramData = await fetchDiagramData(projectId);

        if (diagramData) {
          setNodes(diagramData.nodes);
          setEdges(diagramData.edges);
          // TODO: Detect diagram type from loaded data
          // For now, we'll keep the initial diagram type
        } else {
          toast.info('No diagram found. Starting with an empty diagram.');
        }
      } catch (err) {
        console.error('Error loading diagram:', err);
        toast.error('Failed to load diagram data');
      }
    };

    loadDiagramData();
  }, [projectId, setNodes, setEdges]);

  // Auto-save diagram
  useEffect(() => {
    const saveDiagram = async () => {
      if (!projectId) return;

      toast.info('Saving diagram data...');
      try {
        await saveDiagramData(projectId, nodes, edges, true);
      } catch (err) {
        console.error('Error saving diagram:', err);
        toast.error('Failed to save diagram data');
      }
    };

    const timeoutId = setTimeout(saveDiagram, 1000);
    return () => clearTimeout(timeoutId);
  }, [projectId, nodes, edges]);

  const handleNodesChange: OnNodesChange = React.useCallback(
    (changes) => {
      // For sequence diagrams, lock Y position during drag
      if (currentDiagramType === 'sequence') {
        const LOCKED_Y_POSITION = 50;
        const modifiedChanges = changes.map((change) => {
          if (change.type === 'position' && change.dragging && change.position) {
            return {
              ...change,
              position: {
                x: change.position.x,
                y: LOCKED_Y_POSITION,
              },
            };
          }
          return change;
        });
        onNodesChange(modifiedChanges as NodeChange<any>[]);
      } else {
        onNodesChange(changes as NodeChange<any>[]);
      }
    },
    [onNodesChange, currentDiagramType]
  );

  const handleEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => {
      onEdgesChange(changes as EdgeChange<Edge>[]);
    },
    [onEdgesChange]
  );

  const handleConnect: OnConnect = React.useCallback(
    (connection) => {
      console.log("connection", connection);
      console.log("nodes", nodes);

      // For sequence diagrams, use sequence validation
      if (currentDiagramType === 'sequence') {
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        if (sourceNode && targetNode && 'isValidConnection' in sequenceFlow) {
          const isValid = sequenceFlow.isValidConnection(connection);
          if (!isValid) {
            toast.error("Invalid connection between sequence elements");
            return;
          }
        }

        if (takeSnapshot) takeSnapshot();
        setEdges((eds) => {
          const newEdge = {
            ...connection,
            id: `edge-${Date.now()}`,
            type: 'sequenceMessage',
            data: {
              message_type: selectedEdgeType,
              message_text: 'message()',
              parameters: '',
              sequence_number: eds.length + 1,
              yPosition: 200 + (eds.length * 80),
            }
          };
          return [...eds, newEdge];
        });
        return;
      }

      // For use case diagrams, use existing validation
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (
        selectedEdgeType === "association" &&
        sourceNode?.type === "usecaseshape" &&
        sourceNode?.data?.type === "usecase" &&
        targetNode?.type === "usecaseshape" &&
        targetNode?.data?.type === "usecase"
      ) {
        toast.error("No association allowed between use case nodes.");
        return;
      }

      if (
        (selectedEdgeType === "extend" || selectedEdgeType === "association" ||
         selectedEdgeType === "include" || selectedEdgeType === "aggregation" ||
         selectedEdgeType === "composition") &&
        sourceNode?.type === "usecaseshape" &&
        sourceNode?.data?.type === "actor" &&
        targetNode?.type === "usecaseshape" &&
        targetNode?.data?.type === "actor"
      ) {
        toast.error("Relationship is invalid between actor nodes.");
        return;
      }

      if (takeSnapshot) takeSnapshot();
      enhancedOnConnect(connection);
      console.log("connection", connection);
    },
    [enhancedOnConnect, takeSnapshot, selectedEdgeType, nodes, currentDiagramType, sequenceFlow]
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (takeSnapshot) takeSnapshot();

      // For sequence diagrams, create sequence nodes with proper structure
      if (currentDiagramType === 'sequence') {
        event.preventDefault();
        const shapeType = event.dataTransfer.getData("application/reactflow");

        if (!shapeType) return;

        // Map shape types to element types for sequence diagrams
        const elementTypeMap: Record<string, string> = {
          'sequenceactor': 'actor',
          'boundary': 'boundary',
          'control': 'control',
          'entity': 'entity'
        };

        const elementType = elementTypeMap[shapeType] || shapeType;

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: `seq-${elementType}-${Date.now()}`,
          type: 'sequenceElement',
          position: {
            x: position.x - 60,
            y: 50,
          },
          data: {
            label: '',
            elementType: elementType,
            stereotype: `<<${elementType}>>`,
            hasLifeline: true,
            lifelineLength: 400,
          },
        };

        setNodes((nds: any[]) => [...nds, newNode]);
      } else {
        // Use case diagram - use existing handler
        const newNode = onDrop(event);
        if (newNode) {
          setNodes((nds: any[]) => [...nds, newNode]);
        }
      }
    },
    [onDrop, setNodes, takeSnapshot, currentDiagramType, screenToFlowPosition]
  );

  const handleNodeDragStart: OnNodeDrag = React.useCallback(() => {
    if (takeSnapshot) takeSnapshot();
  }, [takeSnapshot]);

  const handleNodesDelete: OnNodesDelete = React.useCallback(() => {
    if (takeSnapshot) takeSnapshot();
  }, [takeSnapshot]);

  const handleEdgesDelete: OnEdgesDelete = React.useCallback(() => {
    if (takeSnapshot) takeSnapshot();
  }, [takeSnapshot]);

  // Select appropriate node and edge types based on diagram type
  const nodeTypes: NodeTypes = currentDiagramType === 'sequence'
    ? sequenceNodeTypes
    : diagramElementTypes as NodeTypes;

  const activeEdgeTypes: EdgeTypes = currentDiagramType === 'sequence'
    ? sequenceEdgeTypes
    : edgeTypes;

  // Get isValidConnection for sequence diagrams
  const isValidConnection = currentDiagramType === 'sequence' && 'isValidConnection' in sequenceFlow
    ? sequenceFlow.isValidConnection
    : undefined;

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
      <Header onExportImage={handleExportImage} diagramType={currentDiagramType} />
      <div
        className="main-content"
        style={{ flex: 1, position: "relative", minHeight: 0 }}
      >
        <LeftSidebar diagramType={currentDiagramType} />
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
            colorMode="light"
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
            nodeTypes={nodeTypes}
            edgeTypes={activeEdgeTypes}
            connectionMode={ConnectionMode.Loose}
            isValidConnection={isValidConnection}
            proOptions={{ hideAttribution: true }}
            fitView
            style={{ width: "100%", height: "100%" }}
          >
            <FlowControls />
          </ReactFlow>

          {/* Show connection rules helper for sequence diagrams */}
          {currentDiagramType === 'sequence' && (
            <ConnectionRulesHelper position="top-right" />
          )}
        </div>
        <RightSidebar
          nodes={nodes}
          setNodes={
            setNodes as (
              nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])
            ) => void
          }
          deleteNode={deleteNode}
        />
      </div>
      <Footer />
    </div>
  );
};

export default UnifiedCanvasContainer;
