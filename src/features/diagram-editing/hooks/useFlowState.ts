import { useNodesState, useEdgesState } from '@xyflow/react';
import { initialNodes, initialEdges } from '../../parsing/plantuml-use-case/GenerateNodes';
import useCopyPaste from './useCopyAndPaste';
import useUndoAndRedo from './useUndoAndRedo';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { undo, redo, takeSnapshot } = useUndoAndRedo();
  const { cut, copy, paste, bufferedNodes } = useCopyPaste(takeSnapshot);

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