import React, { useState } from 'react';
import { SequenceElementType } from '../../../shared/models/SequenceDiagramElement';
import { getConnectionRulesDescription, getElementTypeLabel } from '../utils/validation/connectionValidation';

interface ConnectionRulesHelperProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ConnectionRulesHelper: React.FC<ConnectionRulesHelperProps> = ({
  position = 'top-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const elementTypes: SequenceElementType[] = ['actor', 'boundary', 'control', 'entity'];

  const positionStyles = {
    'top-right': { top: '10px', right: '10px' },
    'top-left': { top: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        zIndex: 1000,
        backgroundColor: '#fff',
        border: '2px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: isExpanded ? '400px' : 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          borderBottom: isExpanded ? '1px solid #ddd' : 'none',
          borderRadius: isExpanded ? '6px 6px 0 0' : '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          📋 Connection Rules
        </span>
        <span style={{ fontSize: '12px' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '12px' }}>
          <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
            <strong>MVC Three-Tiered Architecture</strong>
            <p style={{ margin: '4px 0' }}>
              Sequence diagrams follow strict layered communication rules:
            </p>
          </div>

          {/* Connection Rules Table */}
          <div style={{ fontSize: '11px' }}>
            {elementTypes.map((type) => (
              <div
                key={type}
                style={{
                  marginBottom: '12px',
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  borderLeft: '3px solid #333',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {getElementTypeLabel(type)}
                </div>
                <div style={{ whiteSpace: 'pre-line', color: '#666', lineHeight: '1.4' }}>
                  {getConnectionRulesDescription(type)}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Layers */}
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#e8f4f8',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Layer Architecture:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>🎭 <strong>Presentation:</strong> Boundary (Views)</div>
              <div>⚙️ <strong>Business:</strong> Control (Controllers)</div>
              <div>💾 <strong>Data:</strong> Entity (Models)</div>
              <div>👤 <strong>External:</strong> Actor (Users/Systems)</div>
            </div>
          </div>

          {/* Key Rules */}
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#fff3cd',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⚠️ Key Rules:</div>
            <ul style={{ margin: '4px 0', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Layers communicate with adjacent layers only</li>
              <li>No direct Actor ↔ Entity communication</li>
              <li>No direct Boundary ↔ Entity communication</li>
              <li>Control layer mediates between layers</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
