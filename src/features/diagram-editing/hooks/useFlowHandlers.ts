import { useCallback } from "react";
import { useReactFlow, addEdge, Edge, Connection } from "@xyflow/react";
import { useDnD } from "../hooks/useDnD";
import { ShapeNode, ShapeType } from "../types/NodeTypes.types";

type FlowHandlersProps = {
  setNodes: (nodes: ShapeNode[]) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
};

export function useFlowHandlers({ setEdges }: FlowHandlersProps) {
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((currentEdges: Edge[]) => {
        console.log("onConnect", params);
        const newEdges: Edge[] = addEdge<Edge>(
          { ...params, type: "straight" },
          currentEdges
        );
        console.log(newEdges);
        return newEdges;
      });
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) {
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

      const newNode: ShapeNode = {
        id: `${type}-${Date.now()}`,
        type: type === 'package' ? 'package' : 'usecaseshape',
        position: adjustedPosition,
        data: {
          type: type as ShapeType,
          label: type === 'actor' ? 'New Actor' : type === 'usecase' ? 'New Use Case' : 'New Package',
          color: type === 'actor' ? '#FFB347' : type === 'usecase' ? '#3F8AE2' : '#98FB98',
        },
      };

      return newNode;
    },
    [screenToFlowPosition, type]
  );

  return { onConnect, onDragOver, onDrop };
}
