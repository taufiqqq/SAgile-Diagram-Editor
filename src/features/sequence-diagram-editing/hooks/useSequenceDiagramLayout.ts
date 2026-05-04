import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { SequenceNodeData } from '../types/SequenceElementTypes';

/**
 * Hook to manage proper sequence diagram layout
 * - Nodes (participants) arranged horizontally at the top
 * - Edges (messages) flow vertically downward based on sequence number
 */
export function useSequenceDiagramLayout() {
  /**
   * Arranges nodes (participants) in horizontal columns at the top
   */
  const arrangeNodes = useCallback((nodes: Node<SequenceNodeData>[]): Node<SequenceNodeData>[] => {
    const NODE_SPACING = 250;
    const START_X = 150;
    const START_Y = 50;

    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: START_X + (index * NODE_SPACING),
        y: START_Y
      },
      data: {
        ...node.data,
        hasLifeline: true,
        lifelineLength: 600
      }
    }));
  }, []);

  /**
   * Calculates edge positions based on sequence number
   */
  const calculateEdgePositions = useCallback((
    edges: Edge[],
    nodes: Node<SequenceNodeData>[]
  ): Edge[] => {
    const EDGE_VERTICAL_SPACING = 50;
    const EDGE_START_Y = 200;

    const sortedEdges = [...edges].sort((a, b) => {
      const seqA = (a.data?.sequence_number as number) || 0;
      const seqB = (b.data?.sequence_number as number) || 0;
      return seqA - seqB;
    });

    return sortedEdges.map((edge, index) => ({
      ...edge,
      data: {
        ...edge.data,
        sequence_number: index + 1,
        yPosition: EDGE_START_Y + (index * EDGE_VERTICAL_SPACING)
      }
    }));
  }, []);

  /**
   * Recalculates entire diagram layout
   */
  const recalculateLayout = useCallback((
    nodes: Node<SequenceNodeData>[],
    edges: Edge[]
  ): { nodes: Node<SequenceNodeData>[]; edges: Edge[] } => {
    const arrangedNodes = arrangeNodes(nodes);
    const positionedEdges = calculateEdgePositions(edges, arrangedNodes);

    const maxLifelineLength = 200 + (positionedEdges.length * 50);
    const updatedNodes = arrangedNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        lifelineLength: maxLifelineLength
      }
    }));

    return {
      nodes: updatedNodes,
      edges: positionedEdges
    };
  }, [arrangeNodes, calculateEdgePositions]);

  /**
   * Adds a new node at the next available position
   */
  const addNode = useCallback((
    nodes: Node<SequenceNodeData>[],
    newNode: Node<SequenceNodeData>
  ): Node<SequenceNodeData>[] => {
    const nodesWithNew = [...nodes, newNode];
    return arrangeNodes(nodesWithNew);
  }, [arrangeNodes]);

  /**
   * Removes a node and reorders remaining ones
   */
  const removeNode = useCallback((
    nodes: Node<SequenceNodeData>[],
    nodeId: string
  ): Node<SequenceNodeData>[] => {
    const filteredNodes = nodes.filter(n => n.id !== nodeId);
    return arrangeNodes(filteredNodes);
  }, [arrangeNodes]);

  return {
    arrangeNodes,
    calculateEdgePositions,
    recalculateLayout,
    addNode,
    removeNode,
  };
}
