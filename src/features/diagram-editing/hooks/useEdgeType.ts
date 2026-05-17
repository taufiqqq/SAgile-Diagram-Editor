import { useState, useCallback } from 'react';

export type EdgeType = 'extend' | 'include' | 'generalization' | 'composition' | 'aggregation' | 'association';
// Shared state at module level
let sharedEdgeType: EdgeType = 'association';
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useEdgeType = () => {
  const [selectedEdgeType, setSelectedEdgeType] = useState<EdgeType>(sharedEdgeType);

  // Subscribe to changes
  useState(() => {
    const listener = () => {
      setSelectedEdgeType(sharedEdgeType);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  });

  const handleEdgeTypeChange = useCallback((type: EdgeType) => {
    console.log('[useEdgeType] Changing edge type from', sharedEdgeType, 'to', type);
    sharedEdgeType = type;
    notifyListeners();
  }, []);

  return {
    selectedEdgeType,
    handleEdgeTypeChange,
  };
}; 