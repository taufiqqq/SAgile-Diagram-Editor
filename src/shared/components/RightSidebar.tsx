import React, { useState } from 'react';
import { DiagramElementNode } from '../../features/diagram-editing/types/DiagramElementType.types';
import { useModal } from '../context/ModalContext';

interface RightSidebarProps {
  nodes: DiagramElementNode[];
  setNodes: (nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])) => void;
  deleteNode: (nodeId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ nodes, deleteNode }) => {
  const [open, setOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const { openModal } = useModal();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nodeIdToDelete, setNodeIdToDelete] = useState<string | null>(null);

  const handleTrashClick = (nodeId: string) => {
    setNodeIdToDelete(nodeId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (nodeIdToDelete) {
      deleteNode(nodeIdToDelete);
      setNodeIdToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setNodeIdToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
  <div style={{ display: 'flex', height: '80vh', border: '2px solid #ddd', borderRadius: '0px'}}>
  <button
        onClick={toggleSidebar}
        style={{
          background: '#f5f5f5',
          borderRadius: '0px',
          padding: '8px',
          // display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
           color: '#000000',
        }}
        title={isVisible ? "Hide sidebar" : "Show sidebar"}
      >
      <span style={{ fontSize: 20 }}>{isVisible ? '▶' : '◀'}</span>
      </button>
      
      <div
        className="rightsidebar"
        style={{
          padding: '10px',
          width: isVisible ? '250px' : '0',
          backgroundColor: '#f5f5f5',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#000000',
          boxSizing: 'border-box',
          overflowY: 'auto',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {isVisible && (
          <>
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          style={{ cursor: 'pointer', marginLeft: 8 }}
                          title="Edit"
                          onClick={() => openModal({ type: String(node.type), label: node.data.label || '', id: String(node.id) })}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </span>
                        <span
                          style={{ cursor: 'pointer', marginLeft: 8, color: '#dc3545' }}
                          title="Delete"
                          onClick={() => handleTrashClick(node.id)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', color: '#333' }}>
            <p>Are you sure you want to delete this node?</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={handleCancelDelete} style={{ marginRight: '10px', padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirmDelete} style={{ padding: '8px 15px', border: 'none', backgroundColor: '#dc3545', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;