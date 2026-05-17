import { useCallback } from 'react';
import { useEdgeType } from './useEdgeType';
import { Connection } from '@xyflow/react';

export const useEdgeConnection = (baseOnConnect: (connection: Connection) => void) => {
  const { selectedEdgeType } = useEdgeType();

  const onConnect = useCallback((connection: Connection) => {
    console.log('[useEdgeConnection] Creating connection with type:', selectedEdgeType);
    console.log('[useEdgeConnection] Original connection:', connection);
    
    // Add the selected edge type to the connection
    const connectionWithType = {
      ...connection,
      type: selectedEdgeType,
    };
    
    console.log('[useEdgeConnection] Modified connection:', connectionWithType);
    
    // Call the base onConnect handler with the modified connection
    baseOnConnect(connectionWithType);
  }, [selectedEdgeType, baseOnConnect]);

  return {
    onConnect,
  };
}; 