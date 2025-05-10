import React, { useCallback } from 'react';
import { useStore } from '@xyflow/react';
import { DiagramElementNode } from '../../features/diagram-editing/types/DiagramElementType.types';

interface RightSidebarProps {
  nodes: DiagramElementNode[];
  setNodes: (nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])) => void;
}

const transformSelector = (state: any) => state.transform;

const RightSidebar: React.FC<RightSidebarProps> = ({ nodes, setNodes }) => {
  const transform = useStore(transformSelector);

  const selectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
  }, [setNodes]);

  return (
    <div className="rightsidebar" style={{ 
      padding: '10px', 
      width: '250px', 
      backgroundColor: '#f5f5f5',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#000000',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div className="description" style={{ 
        marginBottom: '10px', 
        fontSize: '12px',
        lineHeight: '1.4',
        userSelect: 'text'
      }}>
        This is an example of how you can access the internal state outside of
        the ReactFlow component.
      </div>
      <div className="title" style={{ 
        fontWeight: 'bold', 
        marginBottom: '5px',
        fontSize: '14px',
        userSelect: 'text'
      }}>Zoom & pan transform</div>
      <div className="transform" style={{ 
        padding: '8px', 
        backgroundColor: 'white', 
        borderRadius: '4px', 
        marginBottom: '10px',
        border: '1px solid #ddd',
        fontSize: '12px',
        userSelect: 'text'
      }}>
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div className="title" style={{ 
        fontWeight: 'bold', 
        marginBottom: '5px',
        fontSize: '14px',
        userSelect: 'text'
      }}>Nodes</div>
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        paddingRight: '5px'
      }}>
        {nodes.map((node) => (
          <div key={node.id} style={{ 
            padding: '8px', 
            marginBottom: '8px', 
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
            userSelect: 'text'
          }}>
            <div>Node {node.id}</div>
            <div>Label: {node.data.label}</div>
            <div>Position: x: {node.position.x.toFixed(2)}, y: {node.position.y.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="selectall" style={{ marginTop: 'auto' }}>
        <button 
          onClick={selectAll}
          style={{
            padding: '6px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '12px'
          }}
        >
          select all nodes
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;