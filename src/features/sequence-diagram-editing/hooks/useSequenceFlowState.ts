import { useCallback } from 'react';
import { useNodesState, useEdgesState, Connection, addEdge, Node, Edge } from '@xyflow/react';
import { isValidSequenceConnection, getConnectionValidationError } from '../utils/validation/connectionValidation';
import { SequenceNodeData } from '../types/SequenceElementTypes';
import { useSequenceDiagramLayout } from './useSequenceDiagramLayout';
import { SequenceMessageType } from '../../../shared/models/SequenceDiagramMessage';

interface UseSequenceFlowStateProps {
  initialNodes?: Node<SequenceNodeData>[];
  initialEdges?: Edge[];
  selectedMessageType?: SequenceMessageType;
}

export function useSequenceFlowState({
  initialNodes = [],
  initialEdges = [],
  selectedMessageType = 'synchronous'
}: UseSequenceFlowStateProps = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SequenceNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Layout management hook
  const layout = useSequenceDiagramLayout();

  /**
   * Validates and creates a connection between two nodes
   */
  const onConnect = useCallback((connection: Connection) => {
    // Validate the connection
    const isValid = isValidSequenceConnection(connection, nodes);

    if (!isValid) {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);

      if (sourceNode && targetNode) {
        const errorMessage = getConnectionValidationError(
          sourceNode.data.elementType,
          targetNode.data.elementType
        );
        console.warn('Invalid connection attempt:', errorMessage);
        alert(errorMessage);
      }
      return;
    }

    // Connection is valid, add edge with selected message type
    setEdges((eds) => {
      const newEdge = {
        ...connection,
        type: 'sequenceMessage',
        data: {
          message_type: selectedMessageType,
          message_text: 'message()',
          parameters: '',
          sequence_number: eds.length + 1,
        }
      };
      return addEdge(newEdge, eds);
    });
  }, [nodes, setEdges, selectedMessageType]);

  /**
   * Checks if a connection is valid
   */
  const isValidConnection = useCallback((connection: Connection) => {
    return isValidSequenceConnection(connection, nodes);
  }, [nodes]);

  /**
   * Updates a node's data
   */
  const updateNodeData = useCallback((nodeId: string, data: Partial<SequenceNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  /**
   * Updates an edge's data
   */
  const updateEdgeData = useCallback((edgeId: string, data: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...data,
            },
            type: data.message_type || edge.type,
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  /**
   * Adds a new sequence node
   */
  const addSequenceNode = useCallback((
    elementType: SequenceNodeData['elementType'],
    position: { x: number; y: number },
    label: string = ''
  ) => {
    const newNode: Node<SequenceNodeData> = {
      id: `seq-${elementType}-${Date.now()}`,
      type: 'sequenceElement',
      position,
      data: {
        label: label || `New ${elementType}`,
        elementType,
        stereotype: `<<${elementType}>>`,
        hasLifeline: true,
        lifelineLength: 400,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    return newNode;
  }, [setNodes]);

  /**
   * Deletes selected elements
   */
  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  /**
   * Applies sequence diagram layout
   */
  const applyLayoutOnce = useCallback(() => {
    setNodes((currentNodes) => {
      const currentEdges = edges;
      const { nodes: layoutedNodes, edges: layoutedEdges } = layout.recalculateLayout(currentNodes, currentEdges);
      setEdges(layoutedEdges);
      return layoutedNodes;
    });
  }, [layout, setNodes, setEdges, edges]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    isValidConnection,
    updateNodeData,
    updateEdgeData,
    addSequenceNode,
    deleteSelectedElements,
    applyLayout: applyLayoutOnce,
    takeSnapshot: undefined, // Add this for compatibility with UnifiedCanvasContainer
  };
}
