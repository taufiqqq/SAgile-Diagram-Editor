import React, { useState, useCallback } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, useNodes, useReactFlow } from '@xyflow/react';
import { SequenceMessageType } from '../../../shared/models/SequenceDiagramMessage';

/**
 * Custom edge component for sequence diagram messages
 * Renders horizontal arrows between participant lifelines at specific Y positions
 */
export const SequenceMessageEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const nodes = useNodes();
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const messageType = data?.message_type as SequenceMessageType || 'synchronous';
  const messageText = data?.message_text || '';
  const sequenceNumber = data?.sequence_number || 0;
  const yPosition = data?.yPosition || sourceY;

  const handleLabelClick = useCallback(() => {
    setEditText(messageText);
    setIsEditing(true);
  }, [messageText]);

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleLabelBlur = useCallback(() => {
    setIsEditing(false);
    if (editText !== messageText) {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: {
                ...edge.data,
                message_text: editText,
              },
            };
          }
          return edge;
        })
      );
    }
  }, [editText, messageText, id, setEdges]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditText(messageText);
      setIsEditing(false);
    }
  }, [messageText]);

  // Get source and target nodes to calculate lifeline positions
  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);

  // Calculate lifeline X positions (center of each participant)
  // Actor is 75px wide (icon) - center at 37.5px from position
  // Boundary/Control/Entity are 120px wide - center at 60px from position
  const getNodeCenterOffset = (node: any) => {
    if (!node?.data?.elementType) return 60; // Default
    const elementType = node.data.elementType;

    if (elementType === 'actor') {
      return 37.5; // Actor icon is 75px wide, center at 37.5px
    } else {
      return 60; // Boundary/Control/Entity are 120px wide, center at 60px
    }
  };

  const sourceLifelineX = sourceNode ? sourceNode.position.x + getNodeCenterOffset(sourceNode) : sourceX;
  const targetLifelineX = targetNode ? targetNode.position.x + getNodeCenterOffset(targetNode) : targetX;

  // Calculate horizontal line between lifelines
  const startX = sourceLifelineX;
  const endX = targetLifelineX;

  // Use the yPosition from data for consistent vertical placement
  const startY = yPosition;
  const endY = yPosition;

  // Create straight horizontal path
  const edgePath = `M ${startX},${startY} L ${endX},${endY}`;

  // Label position (middle of the line, slightly above)
  const labelX = (startX + endX) / 2;
  const labelY = startY - 10;

  // Determine arrow style based on message type
  const getArrowStyle = () => {
    switch (messageType) {
      case 'return':
        return {
          stroke: '#666',
          strokeWidth: 1.5,
          strokeDasharray: '5,5', // Dashed line for return messages
        };
      case 'asynchronous':
        return {
          stroke: '#333',
          strokeWidth: 2,
          // Open arrow head (handled by markerEnd)
        };
      case 'create':
        return {
          stroke: '#4CAF50',
          strokeWidth: 2,
          strokeDasharray: '0',
        };
      case 'destroy':
        return {
          stroke: '#f44336',
          strokeWidth: 2,
          strokeDasharray: '0',
        };
      case 'synchronous':
      default:
        return {
          stroke: '#333',
          strokeWidth: 2,
          strokeDasharray: '0',
        };
    }
  };

  const arrowStyle = getArrowStyle();

  // Custom arrow marker
  const getArrowMarker = () => {
    if (messageType === 'return') {
      return (
        <marker
          id={`arrow-${id}-return`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="none"
            stroke="#666"
            strokeWidth="1.5"
          />
        </marker>
      );
    }

    return (
      <marker
        id={`arrow-${id}`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 Z"
          fill={messageType === 'create' ? '#4CAF50' : messageType === 'destroy' ? '#f44336' : '#333'}
        />
      </marker>
    );
  };

  return (
    <>
      <defs>
        {getArrowMarker()}
      </defs>

      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          ...arrowStyle,
        }}
        markerEnd={`url(#arrow-${id}${messageType === 'return' ? '-return' : ''})`}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
          }}
          className="nodrag nopan"
        >
          <div
            style={{
              padding: '2px 6px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 'bold', marginRight: '4px', color: '#666' }}>
              {sequenceNumber}.
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={handleLabelChange}
                onBlur={handleLabelBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 12,
                  fontFamily: 'Arial, sans-serif',
                  minWidth: '100px',
                }}
              />
            ) : (
              <span
                onClick={handleLabelClick}
                style={{
                  cursor: 'text',
                  minWidth: '50px',
                  display: 'inline-block',
                }}
              >
                {messageText || 'Click to edit'}
              </span>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
