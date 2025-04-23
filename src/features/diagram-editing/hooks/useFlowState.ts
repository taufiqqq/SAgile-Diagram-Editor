import { useNodesState, useEdgesState } from '@xyflow/react';
import { initialNodes, initialEdges } from '../../parsing/plantuml-use-case/GenerateNodes';
import useCopyPaste from './useCopyAndPaste';
import useUndoAndRedo from './useUndoAndRedo';
import { useEffect } from 'react';
import { ShapeNode } from '../types/NodeTypes.types';
import { fetchDiagramData } from '../services/diagramService';
import { useParams } from 'react-router-dom';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { undo, redo, takeSnapshot } = useUndoAndRedo();
  const { cut, copy, paste, bufferedNodes } = useCopyPaste(takeSnapshot);
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();

  // Load diagram from route parameters if available
  useEffect(() => {
    if (projectId && sprintId) {
      const loadDiagram = async () => {
        try {
          const diagramData = await fetchDiagramData(projectId, sprintId);
          if (diagramData) {
            setNodes(diagramData.nodes);
            setEdges(diagramData.edges);
          }
        } catch (error) {
          console.error('Error loading diagram from URL:', error);
        }
      };
      loadDiagram();
    }
  }, [projectId, sprintId]); // Re-run when route params change

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    cut, 
    copy, 
    paste, 
    bufferedNodes,
    undo,
    redo,
    takeSnapshot
  };
}