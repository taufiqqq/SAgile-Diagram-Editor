// features/diagram-editing/components/nodes/UseCaseNode.tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { UseCaseHtml } from '../shapes-html/UseCase-html';


interface UseCaseNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
  selected: boolean
}

const UseCaseNode: React.FC<UseCaseNodeProps> = ({ data, selected, isConnectable }) => {
  return (
    <div className="usecase-node">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: selected? 'red' : '#555' }}
        isConnectable={isConnectable}
      />
      
      <UseCaseHtml label={data.label} selected = {selected} />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default UseCaseNode;