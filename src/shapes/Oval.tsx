import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Define the types for the props
interface OvalNodeProps {
    data: {
        label: string;
    };
    isConnectable: boolean;
}

// Apply the types to the component
const OvalNode: React.FC<OvalNodeProps> = ({ data, isConnectable }) => {
    return (
        <div
            className="oval-node"
            style={{
                width: 150,
                height: 100,
                borderRadius: '50%',
                background: '#f0f0f0',
                border: '2px solid #555',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
            <strong>{data.label}</strong>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default OvalNode;