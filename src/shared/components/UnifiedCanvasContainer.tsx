import React, { useEffect, useCallback } from "react";
import {
  ConnectionMode,
  NodeTypes,
  ReactFlow,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnNodeDrag,
  OnNodesDelete,
  OnEdgesDelete,
  Edge,
  Connection,
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
  const currentDiagramType = diagramType;
  // Ref is set synchronously at the start of the load effect so the save effect
  // (which runs after in the same flush) sees it immediately and skips saving.
  const isLoadingDiagramRef = React.useRef(true);

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

  // Track the source node of an in-progress sequence connection drag.
  // Using a ref (not state) so handleConnectEnd always reads the latest value
  // without a stale-closure problem.
  const connectingNodeIdRef = React.useRef<string | null>(null);

  const deleteNode = useCallback((nodeId: string) => {
    if (takeSnapshot) takeSnapshot();
    setNodes((nds: any[]) => nds.filter((node: any) => node.id !== nodeId));
    setEdges((eds: any[]) => eds.filter((edge: any) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges, takeSnapshot]);

  // Load diagram data — re-runs when projectId or diagramType changes.
  // The `cancelled` flag prevents a stale async fetch (from a previous diagramType)
  // from resetting the ref or state after the new load has already started.
  useEffect(() => {
    let cancelled = false;

    // Set synchronously so the save effect (which runs after in the same flush)
    // sees it immediately and skips saving during the load.
    isLoadingDiagramRef.current = true;

    const loadDiagramData = async () => {
      if (!projectId) {
        toast.error('Project ID is required');
        if (!cancelled) {
          isLoadingDiagramRef.current = false;
        }
        return;
      }

      try {
        const diagramData = await fetchDiagramData(projectId, diagramType);

        if (cancelled) return; // stale fetch — a newer load is in progress

        if (diagramData) {
          const loadedNodes = diagramType === 'sequence'
            ? diagramData.nodes.map((node: any) => ({
                ...node,
                // Lifelines lock to y=50; fragments keep their saved y position.
                // zIndex ensures lifelines always render above fragments so they
                // intercept mouse events when the two overlap.
                position: node.type === 'sequenceFragment'
                  ? node.position
                  : { ...node.position, y: LOCKED_Y_POSITION },
                zIndex: node.type === 'sequenceFragment' ? 0 : 1,
              }))
            : diagramData.nodes;
          setNodes(loadedNodes);
          setEdges(diagramData.edges);
        } else {
          toast.info('No diagram found. Starting with an empty diagram.');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error loading diagram:', err);
        toast.error('Failed to load diagram data');
      } finally {
        if (!cancelled) {
          isLoadingDiagramRef.current = false;
        }
      }
    };

    loadDiagramData();

    return () => {
      // Mark this fetch as stale so its finally block doesn't reset the ref
      // after a newer load effect has already taken ownership.
      cancelled = true;
    };
  }, [projectId, diagramType, setNodes, setEdges]);

  // Auto-save diagram — suppressed while loading to prevent overwriting on type switch.
  // isLoadingDiagramRef is checked (not state) because the ref is set synchronously
  // in the load effect before this effect runs, closing the race window where
  // isLoadingDiagram state is still false when diagramType changes.
  useEffect(() => {
    if (isLoadingDiagramRef.current) return;

    const saveDiagram = async () => {
      if (!projectId) return;

      toast.info('Saving diagram data...');
      try {
        await saveDiagramData(projectId, nodes as any[], edges as any[], true, diagramType);
      } catch (err) {
        console.error('Error saving diagram:', err);
        toast.error('Failed to save diagram data');
      }
    };

    const timeoutId = setTimeout(saveDiagram, 1000);
    return () => clearTimeout(timeoutId);
  }, [projectId, nodes, edges, diagramType]); // isLoadingDiagram deliberately omitted — we read the ref, not state

  const LOCKED_Y_POSITION = 50;

  const handleNodesChange: OnNodesChange = React.useCallback(
    (changes) => {
      // For sequence diagrams, lock Y only for lifeline nodes (sequenceElement).
      // Fragment nodes (sequenceFragment) can move freely on both axes.
      if (currentDiagramType === 'sequence') {
        const modifiedChanges = changes.map((change) => {
          if (change.type === 'position' && change.position) {
            const node = nodes.find((n) => n.id === change.id);
            if (node?.type === 'sequenceFragment') return change;
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
    [onNodesChange, currentDiagramType, nodes]
  );

  const handleEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => {
      onEdgesChange(changes as EdgeChange<Edge>[]);
    },
    [onEdgesChange]
  );

  // ── Sequence diagram connection via X-proximity ────────────────────────────
  // When the user drags a connection in sequence mode, React Flow's handle-
  // snapping makes it impossible to reach a lifeline that lies behind another
  // one (the intermediate handle intercepts the drag).  Instead we:
  //   1. Record the source node on drag-start.
  //   2. Skip all edge creation in onConnect (so the snapped handle is ignored).
  //   3. On drag-end, find whichever lifeline centre-X is closest to the cursor
  //      and create the edge there.

  // Ref to the canvas div — used to toggle the sequence-connecting CSS class that
  // disables pointer-events on all handles during a drag so intermediate lifelines
  // cannot intercept the cursor.
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleConnectStart: OnConnectStart = React.useCallback(
    (_event, { nodeId }) => {
      if (currentDiagramType === 'sequence') {
        connectingNodeIdRef.current = nodeId ?? null;
        // Freeze all handles so the cursor passes through them freely
        canvasRef.current?.classList.add('sequence-connecting');
      }
    },
    [currentDiagramType]
  );

  const handleConnectEnd: OnConnectEnd = React.useCallback(
    (event) => {
      // Re-enable handle interaction immediately
      canvasRef.current?.classList.remove('sequence-connecting');

      const sourceId = connectingNodeIdRef.current;
      connectingNodeIdRef.current = null;

      if (currentDiagramType !== 'sequence' || !sourceId) return;

      const mouseEvent = event as MouseEvent;
      const { x: cursorX } = screenToFlowPosition({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      });

      // Find the lifeline whose centre-X is closest to the cursor
      let closestNode: (typeof nodes)[number] | null = null;
      let closestDist = Infinity;
      for (const node of nodes) {
        if (node.id === sourceId) continue;
        const w = ((node as any).measured?.width ?? 100) as number;
        const centerX = node.position.x + w / 2;
        const dist = Math.abs(centerX - cursorX);
        if (dist < closestDist) { closestDist = dist; closestNode = node; }
      }

      // Ignore drops that are too far from any lifeline
      if (!closestNode || closestDist > 100) return;

      const connection: Connection = {
        source: sourceId,
        target: closestNode.id,
        sourceHandle: 'lifeline',
        targetHandle: 'lifeline',
      };

      // Type-rule validation
      if ('isValidConnection' in sequenceFlow) {
        if (!sequenceFlow.isValidConnection(connection)) {
          toast.error('Invalid connection between sequence elements');
          return;
        }
      }

      if (takeSnapshot) takeSnapshot();
      setEdges((eds: Edge[]) => [
        ...eds,
        {
          ...connection,
          id: `edge-${Date.now()}`,
          type: 'sequenceMessage',
          data: {
            message_type: selectedEdgeType,
            message_text: 'message()',
            parameters: '',
            sequence_number: eds.length + 1,
            yPosition: 200 + (eds.length * 50),
          },
        },
      ]);
    },
    [
      currentDiagramType, nodes,
      sequenceFlow, setEdges, selectedEdgeType,
      takeSnapshot, screenToFlowPosition,
    ]
  );

  const handleConnect: OnConnect = React.useCallback(
    (connection) => {
      // Sequence diagram edges are created in handleConnectEnd (X-proximity),
      // so we skip creation here to avoid connecting to the wrong (snapped) node.
      if (currentDiagramType === 'sequence') return;

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

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // ── Combined Fragment drop ───────────────────────────────────
        if (shapeType.startsWith('fragment-')) {
          const operator = shapeType.replace('fragment-', '');
          const newNode = {
            id: `fragment-${operator}-${Date.now()}`,
            type: 'sequenceFragment',
            // Fragments sit behind lifeline nodes (zIndex 0 < lifeline zIndex 1)
            // so lifelines remain selectable when they overlap a fragment.
            zIndex: 0,
            position: {
              x: position.x - 100,
              y: position.y - 60,
            },
            style: { width: 300, height: 180 },
            data: {
              operator,
              guard: '',
              altGuard: '',
            },
          };
          setNodes((nds: any[]) => [...nds, newNode]);
          return;
        }

        // ── Lifeline (sequenceElement) drop ──────────────────────────
        const elementTypeMap: Record<string, string> = {
          'sequenceactor': 'actor',
          'boundary': 'boundary',
          'control': 'control',
          'entity': 'entity'
        };

        const elementType = elementTypeMap[shapeType] || shapeType;

        const newNode = {
          id: `seq-${elementType}-${Date.now()}`,
          type: 'sequenceElement',
          zIndex: 1, // always above fragment nodes (zIndex 0)
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

  // For sequence diagrams, edges are created in handleConnectEnd using X-proximity,
  // so isValidConnection only needs to show self-connections as invalid (red).
  // All cross-node handles show green so the user gets visual feedback while dragging.
  const isValidConnection = currentDiagramType === 'sequence'
    ? (conn: Edge | Connection) => conn.source !== conn.target
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
          ref={canvasRef}
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
            onConnectStart={handleConnectStart}
            onConnectEnd={handleConnectEnd}
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

          {/* Show connection rules helper for sequence diagrams
          {currentDiagramType === 'sequence' && (
            <ConnectionRulesHelper position="top-right" />
          )} */}
        </div>
        <RightSidebar
          nodes={nodes as DiagramElementNode[]}
          setNodes={
            setNodes as (
              nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])
            ) => void
          }
          deleteNode={deleteNode}
          diagramType={currentDiagramType}
          edges={edges}
          deleteEdge={(edgeId) => {
            if (takeSnapshot) takeSnapshot();
            setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.id !== edgeId));
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default UnifiedCanvasContainer;
