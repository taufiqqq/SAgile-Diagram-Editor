import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiagramType } from '../models/Diagram';

interface DiagramTypeSwitcherProps {
  currentType: DiagramType;
}

export const DiagramTypeSwitcher: React.FC<DiagramTypeSwitcherProps> = ({
  currentType
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const handleTypeChange = (newType: DiagramType) => {
    if (!projectId) return;

    // Navigate to the appropriate route
    const newPath = `/${newType}/${projectId}`;
    navigate(newPath);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        padding: '4px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        border: '1px solid #ddd',
      }}
    >
      <span style={{ fontSize: '12px', color: '#666', paddingLeft: '4px' }}>
        Diagram Type:
      </span>

      <button
        onClick={() => handleTypeChange('usecase')}
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: currentType === 'usecase' ? 'bold' : 'normal',
          backgroundColor: currentType === 'usecase' ? '#333' : 'transparent',
          color: currentType === 'usecase' ? '#fff' : '#333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (currentType !== 'usecase') {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }
        }}
        onMouseLeave={(e) => {
          if (currentType !== 'usecase') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        Use Case
      </button>

      <button
        onClick={() => handleTypeChange('sequence')}
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: currentType === 'sequence' ? 'bold' : 'normal',
          backgroundColor: currentType === 'sequence' ? '#333' : 'transparent',
          color: currentType === 'sequence' ? '#fff' : '#333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (currentType !== 'sequence') {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }
        }}
        onMouseLeave={(e) => {
          if (currentType !== 'sequence') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        Sequence
      </button>
    </div>
  );
};
