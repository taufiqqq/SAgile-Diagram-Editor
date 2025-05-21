import { useState, useCallback } from 'react';

export type EdgeType = 'default' | 'extend' | 'include' | 'generalization' | 'composition' | 'aggregation';

export const useEdgeType = () => {
  const [selectedEdgeType, setSelectedEdgeType] = useState<EdgeType>('default');

  const handleEdgeTypeChange = useCallback((type: EdgeType) => {
    setSelectedEdgeType(type);
  }, []);

  return {
    selectedEdgeType,
    handleEdgeTypeChange,
  };
}; 