import React, { useState, useCallback } from 'react';
import { NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';

export type FragmentOperator = 'opt' | 'alt' | 'loop' | 'par' | 'ref' | 'break';

export interface FragmentNodeData extends Record<string, unknown> {
  operator: FragmentOperator;
  guard?: string;    // guard condition shown in brackets
  altGuard?: string; // guard for the second partition of 'alt'
}

const OPERATOR_COLORS: Record<FragmentOperator, { bg: string; border: string }> = {
  opt:   { bg: 'rgba(220,220,220,0.35)', border: '#555' },
  alt:   { bg: 'rgba(220,220,220,0.35)', border: '#555' },
  loop:  { bg: 'rgba(220,220,220,0.35)', border: '#555' },
  par:   { bg: 'rgba(220,220,220,0.35)', border: '#555' },
  ref:   { bg: 'rgba(220,220,220,0.35)', border: '#555' },
  break: { bg: 'rgba(220,220,220,0.35)', border: '#555' },
};

/**
 * UML Combined Fragment node for sequence diagrams.
 *
 * Renders a resizable rectangle with:
 *  - A pentagon label (operator) in the top-left corner
 *  - An optional guard condition in [brackets]
 *  - A dashed divider for 'alt' fragments (separating the two alternatives)
 *  - Semi-transparent background so underlying lifelines remain visible
 *
 * The node is placed at a lower z-index (0) than lifeline nodes (1) so that
 * lifelines and messages remain selectable when they overlap the fragment area.
 */
export const SequenceFragmentNode: React.FC<NodeProps> = ({
  id,
  data,
  selected,
}) => {
  const operator = (data?.operator as FragmentOperator) ?? 'opt';
  const guard    = (data?.guard    as string) ?? '';
  const altGuard = (data?.altGuard as string) ?? '';

  const { bg, border } = OPERATOR_COLORS[operator] ?? OPERATOR_COLORS.opt;

  const { setNodes } = useReactFlow();

  const [editingGuard, setEditingGuard]    = useState(false);
  const [editingAlt,   setEditingAlt]      = useState(false);
  const [guardDraft,   setGuardDraft]      = useState(guard);
  const [altDraft,     setAltDraft]        = useState(altGuard);

  const commitGuard = useCallback(() => {
    setEditingGuard(false);
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, guard: guardDraft } } : n
    ));
  }, [id, guardDraft, setNodes]);

  const commitAlt = useCallback(() => {
    setEditingAlt(false);
    setNodes(nds => nds.map(n =>
      n.id === id ? { ...n, data: { ...n.data, altGuard: altDraft } } : n
    ));
  }, [id, altDraft, setNodes]);

  // Pentagon clip-path for the operator label:
  // top-left, top-right, notch-right, notch-bottom, bottom-left
  const pentagonClip = 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)';

  return (
    <>
      <NodeResizer
        minWidth={160}
        minHeight={80}
        isVisible={selected}
        lineStyle={{ borderColor: border, borderWidth: 1 }}
        handleStyle={{ backgroundColor: border, width: 8, height: 8 }}
      />

      {/* Main fragment body — fills the React Flow node's measured dimensions */}
      <div
        style={{
          width:  '100%',
          height: '100%',
          border: `2px solid ${border}`,
          backgroundColor: bg,
          boxSizing: 'border-box',
          position: 'relative',
          borderRadius: 2,
        }}
      >
        {/* ── Pentagon operator label ──────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            height: 24,
            paddingRight: 16, // extra room for the notch
            background: border,
            clipPath: pentagonClip,
            zIndex: 1,
          }}
        >
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 11,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.5px',
              paddingLeft: 6,
              paddingRight: 4,
              userSelect: 'none',
            }}
          >
            {operator}
          </span>
        </div>

        {/* ── Guard condition for opt / alt (top partition) ─────────── */}
        {(operator === 'opt' || operator === 'alt' || operator === 'loop') && (
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: 70,
              fontSize: 11,
              fontFamily: 'Arial, sans-serif',
              color: border,
              cursor: 'text',
            }}
            className="nodrag nopan"
          >
            {editingGuard ? (
              <input
                autoFocus
                value={guardDraft}
                onChange={e => setGuardDraft(e.target.value)}
                onBlur={commitGuard}
                onKeyDown={e => { if (e.key === 'Enter') commitGuard(); if (e.key === 'Escape') { setGuardDraft(guard); setEditingGuard(false); } }}
                style={{
                  border: 'none',
                  borderBottom: `1px solid ${border}`,
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 11,
                  fontFamily: 'Arial, sans-serif',
                  color: border,
                  width: 120,
                }}
              />
            ) : (
              <span
                onClick={() => { setGuardDraft(guard); setEditingGuard(true); }}
                title="Click to edit guard"
              >
                {guard ? `[${guard}]` : '[condition]'}
              </span>
            )}
          </div>
        )}

        {/* ── 'alt' dashed divider and second guard ─────────────────── */}
        {operator === 'alt' && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                borderTop: `1.5px dashed ${border}`,
                pointerEvents: 'none',
              }}
            />
            {/* Guard for the second (else) partition */}
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% + 4px)',
                left: 8,
                fontSize: 11,
                fontFamily: 'Arial, sans-serif',
                color: border,
                cursor: 'text',
              }}
              className="nodrag nopan"
            >
              {editingAlt ? (
                <input
                  autoFocus
                  value={altDraft}
                  onChange={e => setAltDraft(e.target.value)}
                  onBlur={commitAlt}
                  onKeyDown={e => { if (e.key === 'Enter') commitAlt(); if (e.key === 'Escape') { setAltDraft(altGuard); setEditingAlt(false); } }}
                  style={{
                    border: 'none',
                    borderBottom: `1px solid ${border}`,
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 11,
                    fontFamily: 'Arial, sans-serif',
                    color: border,
                    width: 120,
                  }}
                />
              ) : (
                <span
                  onClick={() => { setAltDraft(altGuard); setEditingAlt(true); }}
                  title="Click to edit else-guard"
                >
                  {altGuard ? `[${altGuard}]` : '[else]'}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
