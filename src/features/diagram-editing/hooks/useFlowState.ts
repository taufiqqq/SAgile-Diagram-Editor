import { useNodesState, useEdgesState } from '@xyflow/react';
// import { initialNodes, initialEdges } from '../../parsing/plantuml-use-case/GenerateNodes';
import useCopyPaste from './useCopyAndPaste';
import useUndoAndRedo from './useUndoAndRedo';
import { useEffect } from 'react';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { undo, redo, takeSnapshot } = useUndoAndRedo();
  const { cut, copy, paste, bufferedNodes } = useCopyPaste(takeSnapshot);

  // Load diagram from URL parameters if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        if (parsedData.nodes) setNodes(parsedData.nodes);
        if (parsedData.edges) setEdges(parsedData.edges);
        
        // Clear the URL parameters after loading
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Error parsing URL data:', error);
      }
    }
  }, []); // Run only once on mount

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