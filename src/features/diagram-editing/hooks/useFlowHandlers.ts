import { useCallback } from "react";
import { useReactFlow, addEdge, Edge, Connection } from "@xyflow/react";
import { useDnD } from "../hooks/useDnD";
import { DiagramElementNode, DiagramElementType } from "../types/DiagramElementType.types";
import { useEdgeType } from "./useEdgeType";

type FlowHandlersProps = {
  setNodes: (nodes: DiagramElementNode[]) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
};

export function useFlowHandlers({ setEdges }: FlowHandlersProps) {
  const { screenToFlowPosition } = useReactFlow();
  const { diagramElementType, shapeType } = useDnD();
  const { selectedEdgeType } = useEdgeType();

  // console.log('[useFlowHandlers] Using edge type:', selectedEdgeType);

  const onConnect = useCallback(
    (params: Connection) => {
      // console.log('[useFlowHandlers] onConnect called with params:', params);
      // console.log('[useFlowHandlers] Using edge type:', selectedEdgeType);
      
      setEdges((currentEdges: Edge[]) => {
        // console.log('[useFlowHandlers] Current edges:', currentEdges);
        
        const newEdge = { ...params, type: selectedEdgeType };
        // console.log('[useFlowHandlers] Creating new edge with config:', newEdge);
        
        const newEdges: Edge[] = addEdge<Edge>(newEdge, currentEdges);
        // console.log('[useFlowHandlers] New edges after addEdge:', newEdges);
        
        return newEdges;
      });
    },
    [setEdges, selectedEdgeType]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!diagramElementType) {
        console.error("No node type found in drag event");
        return null;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const adjustedPosition = {
        x: position.x - 75,
        y: position.y - 50,
      };

      const newNode: DiagramElementNode = {
        id: `${diagramElementType}-${Date.now()}`,
        type: diagramElementType,
        position: adjustedPosition,
        data: {
          type: shapeType,
          label: '',
        },
        zIndex: shapeType === 'package' ? -10 : undefined,
      };

      return newNode;
    },
    [screenToFlowPosition, diagramElementType, shapeType]
  );

  return { onConnect, onDragOver, onDrop };
}
