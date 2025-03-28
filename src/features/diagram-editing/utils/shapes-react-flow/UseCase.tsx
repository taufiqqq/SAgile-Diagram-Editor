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
        id={data.label+'-left'}
        type="source"
        position={Position.Left}
        style={{ background: selected? 'red' : '#555' , width: '10px', height: '10px'}}
        isConnectable={isConnectable}
      />
      
      <UseCaseHtml label={data.label} selected = {selected} />
      
      <Handle
        id={data.label+'-right'}
        type="source"
        position={Position.Right}
        style={{ background: '#555' , width: '10px', height: '10px'}}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default UseCaseNode;