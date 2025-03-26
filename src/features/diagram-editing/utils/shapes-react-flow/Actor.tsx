// features/diagram-editing/components/nodes/ActorNode.tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActorHtml } from '../shapes-html/Actor-html';


interface ActorNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const ActorNode: React.FC<ActorNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="actor-node">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      
      <ActorHtml label={data.label} />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ActorNode;