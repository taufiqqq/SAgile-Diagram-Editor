import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EdgeType } from '../types/EdgeTypes.types';
import { toast } from 'react-toastify';

interface EdgeTypeSelectorModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (type: EdgeType) => void;
  currentType: EdgeType;
  source: string;
  target: string;
}

const EDGE_TYPES: EdgeType[] = [
  'association',
  'include',
  'extend',
  'generalization',
  'composition',
  'aggregation',
];

const EdgeTypeSelectorModal: React.FC<EdgeTypeSelectorModalProps> = ({
  position,
  onClose,
  onSelect,
  currentType,
  source,
  target,
}) => {
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.edge-type-modal')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleTypeSelect = (type: EdgeType) => {
    // Check if both source and target are use cases
    if (type === 'association' && 
        source.toLowerCase().startsWith('usecase') && 
        target.toLowerCase().startsWith('usecase')) {
      toast.error('Cannot create association between use cases');
      onClose();
      return;
    }
    onSelect(type);
  };

  const modalContent = (
    <div
      className="edge-type-modal"
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        zIndex: 9999,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 120,
      }}
    >
      {EDGE_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => handleTypeSelect(type)}
          style={{
            padding: '4px 8px',
            background: currentType === type ? '#3b82f6' : 'white',
            color: currentType === type ? 'white' : 'black',
            border: 'none',
            borderRadius: 3,
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '12px',
            width: '100%',
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EdgeTypeSelectorModal; 