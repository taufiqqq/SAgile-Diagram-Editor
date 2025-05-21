import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReactFlow, MarkerType } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';

interface EdgeTypeSelectorPortalProps {
  id: string;
  selected: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  currentType: EdgeType;
}

const EdgeTypeSelectorPortal: React.FC<EdgeTypeSelectorPortalProps> = ({
  id,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  currentType,
}) => {
  const { setEdges } = useReactFlow();
  const [mounted, setMounted] = useState(false);
  const [screenCoords, setScreenCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (selected && mounted) {
      // Calculate the center position of the edge
      const centerX = (sourceX + targetX) / 2;
      const centerY = (sourceY + targetY) / 2;

      // Convert SVG coordinates to screen coordinates
      const svgElement = document.querySelector('.react-flow__viewport');
      if (svgElement) {
        const svgRect = svgElement.getBoundingClientRect();
        const transform = svgElement.getAttribute('transform');
        
        // Parse the transform matrix to get the scale and translation
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        
        if (transform) {
          const match = transform.match(/matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/);
          if (match) {
            scale = parseFloat(match[1]);
            translateX = parseFloat(match[5]);
            translateY = parseFloat(match[6]);
          }
        }
        
        // Calculate screen coordinates
        const screenX = svgRect.left + (centerX * scale + translateX);
        const screenY = svgRect.top + (centerY * scale + translateY);
        
        setScreenCoords({ x: screenX, y: screenY });
      }
    }
  }, [selected, mounted, sourceX, sourceY, targetX, targetY]);

  const handleTypeChange = (type: EdgeType) => {
  setEdges((eds) =>
    eds.map((edge) => {
      if (edge.id === id) {
        return {
          ...edge,
          type, // <-- update the edge type for React Flow
          data: { ...edge.data, type }, // <-- update the data type for your logic
        };
      }
      return edge;
    })
  );
};

  if (!mounted || !selected) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: screenCoords.x - 75,
        top: screenCoords.y - 20,
        zIndex: 99999,
        background: 'white',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '4px',
      }}
    >
      <button
        onClick={() => handleTypeChange('association')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'association' ? '#3b82f6' : 'white',
          color: currentType === 'association' ? 'white' : 'black',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Association
      </button>
      <button
        onClick={() => handleTypeChange('include')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'include' ? '#10B981' : 'white',
          color: currentType === 'include' ? 'white' : 'black',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Include
      </button>
      <button
        onClick={() => handleTypeChange('extend')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'extend' ? '#EF4444' : 'white',
          color: currentType === 'extend' ? 'white' : 'black',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Extend
      </button>
      <button
        onClick={() => handleTypeChange('generalization')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'generalization' ? '#06B6D4' : 'white', // cyan-500
          color: currentType === 'generalization' ? 'white' : 'black',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Generalization
      </button>
      <button
        onClick={() => handleTypeChange('composition')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'composition' ? '#A78BFA' : 'white', // purple-400
          color: currentType === 'composition' ? 'white' : 'black',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Composition
      </button>
      <button
        onClick={() => handleTypeChange('aggregation')}
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          background: currentType === 'aggregation' ? '#FEF9C3' : 'white', // light yellow
          color: currentType === 'aggregation' ? '#92400E' : 'black', // dark yellow text if selected
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Aggregation
      </button>

    </div>,
    document.body
  );
};

export default EdgeTypeSelectorPortal; 