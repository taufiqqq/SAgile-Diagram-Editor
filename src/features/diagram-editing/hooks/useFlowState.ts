import { useNodesState, useEdgesState } from '@xyflow/react';
import { initialNodes, initialEdges } from '../../parsing/plantuml-use-case/GenerateNodes';
import useCopyPaste from './useCopyAndPaste';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { cut, copy, paste, bufferedNodes } = useCopyPaste();

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
    bufferedNodes
  };
}