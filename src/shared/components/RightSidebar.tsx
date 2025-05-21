import React, { useState } from 'react';
import { DiagramElementNode } from '../../features/diagram-editing/types/DiagramElementType.types';
import { useModal } from '../context/ModalContext';

interface RightSidebarProps {
  nodes: DiagramElementNode[];
  setNodes: (nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ nodes }) => {
  const [open, setOpen] = useState(true);
  const { openModal } = useModal();

  return (
    <div
      className="rightsidebar"
      style={{
        padding: '10px',
        width: '250px',
        backgroundColor: '#f5f5f5',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#000000',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
>
<p style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Project Browser</p>
      <div
        style={{
          border: '1.5px solid #222',
          borderRadius: 8,
          background: '#fff',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: open ? '1px solid #eee' : 'none',
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>Use Case Diagram</span>
          <span style={{ fontSize: 18 }}>{open ? '▾' : '▸'}</span>
        </div>
        {open && (
          <div style={{ padding: '8px 0' }}>
            {nodes.filter((node) => node.type === "usecaseshape").map((node) => (
              <div
                key={node.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 14,
                  background: '#fff',
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.data.label}</span>
                <span
                  style={{ cursor: 'pointer', marginLeft: 8 }}
                  title="Edit"
                  onClick={() => openModal({ type: String(node.type), label: node.data.label || '', id: String(node.id) })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;