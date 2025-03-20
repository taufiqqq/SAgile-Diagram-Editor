import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Define the types for the props
interface ActorNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

// Apply the types to the component
const ActorNode: React.FC<ActorNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="actor-node">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img width={100} src="/actor.svg" alt="Actor Icon" className="actor-icon" />
        <strong>{data.label}</strong>
      </div>
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
