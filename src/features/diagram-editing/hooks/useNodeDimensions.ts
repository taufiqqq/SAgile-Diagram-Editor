import { useStore } from '@xyflow/react';

// This will return the current dimensions of the node (measured internally by react flow)
export function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  };
} 