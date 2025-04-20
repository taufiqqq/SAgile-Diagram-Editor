import React from 'react';
import { EdgeProps, getStraightPath, useReactFlow, MarkerType } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';

/**
 * A custom React Flow edge component that renders a styled edge with optional 
 * labels and interactive controls for changing the edge type. The edge supports 
 * three types: "association", "include", and "exclude", each with distinct 
 * visual styles and behaviors.
 *
 * @component
 * @param {EdgeProps & { data?: { type?: EdgeType } }} props - The properties for the custom edge.
 * @param {string} props.id - The unique identifier for the edge.
 * @param {number} props.sourceX - The X-coordinate of the source node.
 * @param {number} props.sourceY - The Y-coordinate of the source node.
 * @param {number} props.targetX - The X-coordinate of the target node.
 * @param {number} props.targetY - The Y-coordinate of the target node.
 * @param {React.CSSProperties} [props.style] - Optional custom styles for the edge.
 * @param {boolean} props.selected - Indicates whether the edge is currently selected.
 * @param {{ type?: EdgeType }} [props.data] - Optional data object containing the edge type.
 *
 * @returns {JSX.Element} The rendered custom edge component.
 *
 * @remarks
 * - The edge type can be changed interactively when the edge is selected, using 
 *   buttons rendered in a floating control panel.
 * - The edge type affects the visual style, including stroke dash patterns, 
 *   labels, and marker ends.
 * - The component uses `useReactFlow` to update the edge state dynamically.
 *
 * @example
 * ```tsx
 * <CustomEdge
 *   id="edge-1"
 *   sourceX={100}
 *   sourceY={200}
 *   targetX={300}
 *   targetY={400}
 *   selected={true}
 *   data={{ type: 'include' }}
 * />
 * ```
 */
const CustomEdge: React.FC<EdgeProps & { data?: { type?: EdgeType } }> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
  data = { type: 'association' },
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeType: EdgeType = data.type || 'association';

  const handleTypeChange = (type: EdgeType) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: { ...edge.data, type },
            style: { 
              ...edge.style,
              strokeDasharray: type === 'association' ? undefined : '5 5' 
            },
            label: type === 'association' ? undefined : `«${type}»`,
            labelStyle: { fill: '#000', fontFamily: 'monospace' },
            animated: false,
            markerEnd: type === 'association' ? undefined : {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#b1b1b7',
            },
          };
        }
        return edge;
      })
    );
  };

  return (
    <>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#b1b1b7" />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 20,
          stroke: 'transparent',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <path
        id={`${id}-visible`}
        style={{
          ...style,
          strokeDasharray: edgeType === 'association' ? undefined : '5 5',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={edgeType === 'association' ? undefined : "url(#arrow)"}
      />
      {edgeType !== 'association' && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          style={{
            fill: '#000',
            fontFamily: 'monospace',
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {`«${edgeType}»`}
        </text>
      )}
      {selected && (
        <foreignObject
          x={(sourceX + targetX) / 2 - 75}
          y={(sourceY + targetY) / 2 - 20}
          width={150}
          height={40}
          style={{ 
            overflow: 'visible', 
            pointerEvents: 'all',
            zIndex: 1000
          }}
        >
          <div style={{ 
            position: 'absolute',
            background: 'white',
            padding: '4px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => handleTypeChange('association')}
              style={{
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'association' ? '#3b82f6' : 'white',
                color: edgeType === 'association' ? 'white' : 'black',
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
                background: edgeType === 'include' ? '#10B981' : 'white',
                color: edgeType === 'include' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Include
            </button>
            <button
              onClick={() => handleTypeChange('exclude')}
              style={{
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'exclude' ? '#EF4444' : 'white',
                color: edgeType === 'exclude' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Exclude
            </button>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge; 