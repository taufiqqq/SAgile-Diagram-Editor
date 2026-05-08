import React, { useState } from 'react';
import { DiagramElementNode } from '../../features/diagram-editing/types/DiagramElementType.types';
import { useModal } from '../context/ModalContext';

interface RightSidebarProps {
  nodes: DiagramElementNode[];
  setNodes: (nodes: DiagramElementNode[] | ((nodes: DiagramElementNode[]) => DiagramElementNode[])) => void;
  deleteNode: (nodeId: string) => void;
  diagramType?: string;
  edges?: any[];
  deleteEdge?: (edgeId: string) => void;
}

// Small colour-coded badge showing the element stereotype
const ElementBadge: React.FC<{ type: string }> = ({ type }) => {
  const colours: Record<string, string> = {
    actor: '#555',
    boundary: '#555',
    control: '#555',
    entity: '#555',
  };
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      color: '#fff',
      background: colours[type] ?? '#888',
      borderRadius: 4,
      padding: '1px 5px',
      marginRight: 6,
      flexShrink: 0,
      textTransform: 'capitalize',
    }}>
      {type}
    </span>
  );
};

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
);

const RightSidebar: React.FC<RightSidebarProps> = ({
  nodes,
  deleteNode,
  diagramType,
  edges = [],
  deleteEdge,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Use-case section state
  const [ucOpen, setUcOpen] = useState(true);

  // Sequence section state
  const [seqOpen, setSeqOpen] = useState(true);
  const [lifelinesOpen, setLifelinesOpen] = useState(true);
  const [messagesOpen, setMessagesOpen] = useState(true);
  const [fragmentsOpen, setFragmentsOpen] = useState(true);

  // Delete confirmation (shared between nodes and edges)
  // `displayName` is shown in the confirmation dialog ("lifeline", "message", "fragment")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; kind: 'node' | 'edge'; displayName: string } | null>(null);

  const { openModal } = useModal();

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'node') deleteNode(deleteTarget.id);
    else deleteEdge?.(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isSequence = diagramType === 'sequence';

  // Derived data for sequence browser
  const lifelines = isSequence
    ? nodes.filter((n) => (n as any).type === 'sequenceElement')
    : [];

  const fragments = isSequence
    ? nodes.filter((n) => (n as any).type === 'sequenceFragment')
    : [];

  const messages = isSequence ? [...edges].sort((a, b) => {
    const sa = (a.data?.sequence_number as number) ?? 0;
    const sb = (b.data?.sequence_number as number) ?? 0;
    return sa - sb;
  }) : [];

  const nodeLabel = (id: string) =>
    (nodes.find((n) => n.id === id) as any)?.data?.label || id;

  // ─── Shared row style ────────────────────────────────────────────────
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 14px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: 13,
    background: '#fff',
    gap: 6,
  };

  const iconBtn = (_title: string, _onClick: () => void, color = '#555'): React.CSSProperties => ({
    cursor: 'pointer',
    color,
    flexShrink: 0,
    lineHeight: 0,
  });

  const sectionHeader = (label: string, open: boolean, toggle: () => void): React.ReactNode => (
    <div
      onClick={toggle}
      style={{
        fontWeight: 600,
        fontSize: 14,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        borderBottom: open ? '1px solid #eee' : 'none',
        userSelect: 'none',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 16 }}>{open ? '▾' : '▸'}</span>
    </div>
  );

  const subHeader = (label: string, count: number, open: boolean, toggle: () => void): React.ReactNode => (
    <div
      onClick={toggle}
      style={{
        fontWeight: 500,
        fontSize: 12,
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        background: '#f8f8f8',
        borderBottom: '1px solid #eee',
        userSelect: 'none',
        color: '#555',
      }}
    >
      <span>{label} <span style={{ fontWeight: 400, color: '#999' }}>({count})</span></span>
      <span style={{ fontSize: 14 }}>{open ? '▾' : '▸'}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '80vh', border: '2px solid #ddd', borderRadius: '0px' }}>
      <button
        onClick={() => setIsVisible((v) => !v)}
        style={{
          background: '#f5f5f5',
          borderRadius: '0px',
          padding: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
        }}
        title={isVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        <span style={{ fontSize: 20 }}>{isVisible ? '▶' : '◀'}</span>
      </button>

      <div
        className="rightsidebar"
        style={{
          padding: isVisible ? '10px' : '0',
          width: isVisible ? '260px' : '0',
          backgroundColor: '#f5f5f5',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#000000',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          overflowY: isVisible ? 'auto' : 'hidden',
          transition: 'width 0.3s ease',
        }}
      >
        {isVisible && (
          <>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Project Browser</p>

            {/* ── Sequence Diagram Browser ─────────────────────────── */}
            {isSequence && (
              <div style={{ border: '1.5px solid #222', borderRadius: 8, background: '#fff', marginBottom: 12 }}>
                {sectionHeader('Sequence Diagram', seqOpen, () => setSeqOpen((v) => !v))}

                {seqOpen && (
                  <>
                    {/* Lifelines */}
                    {subHeader('Lifelines', lifelines.length, lifelinesOpen, () => setLifelinesOpen((v) => !v))}
                    {lifelinesOpen && (
                      <div>
                        {lifelines.length === 0 && (
                          <div style={{ padding: '8px 14px', fontSize: 12, color: '#999' }}>No lifelines yet</div>
                        )}
                        {lifelines.map((node) => {
                          const n = node as any;
                          return (
                            <div key={node.id} style={rowStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                                <ElementBadge type={n.data?.elementType ?? 'actor'} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {n.data?.label || '(unnamed)'}
                                </span>
                              </div>
                              <span
                                title="Delete lifeline"
                                style={iconBtn('Delete', () => {}, '#dc3545')}
                                onClick={() => setDeleteTarget({ id: node.id, kind: 'node', displayName: 'lifeline' })}
                              >
                                <TrashIcon />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Messages */}
                    {subHeader('Messages', messages.length, messagesOpen, () => setMessagesOpen((v) => !v))}
                    {messagesOpen && (
                      <div>
                        {messages.length === 0 && (
                          <div style={{ padding: '8px 14px', fontSize: 12, color: '#999' }}>No messages yet</div>
                        )}
                        {messages.map((edge) => {
                          const seq = (edge.data?.sequence_number as number) ?? '?';
                          const text = (edge.data?.message_text as string) || '(message)';
                          const src = nodeLabel(edge.source);
                          const tgt = nodeLabel(edge.target);
                          return (
                            <div key={edge.id} style={rowStyle}>
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {seq}. {text}
                                </span>
                                <span style={{ fontSize: 11, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {src} → {tgt}
                                </span>
                              </div>
                              <span
                                title="Delete message"
                                style={iconBtn('Delete', () => {}, '#dc3545')}
                                onClick={() => setDeleteTarget({ id: edge.id, kind: 'edge', displayName: 'message' })}
                              >
                                <TrashIcon />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Fragments */}
                    {subHeader('Fragments', fragments.length, fragmentsOpen, () => setFragmentsOpen((v) => !v))}
                    {fragmentsOpen && (
                      <div>
                        {fragments.length === 0 && (
                          <div style={{ padding: '8px 14px', fontSize: 12, color: '#999' }}>No fragments yet</div>
                        )}
                        {fragments.map((node) => {
                          const n = node as any;
                          const operator: string = n.data?.operator ?? 'opt';
                          const guard: string = n.data?.guard ?? '';
                          const color = '#555';
                          return (
                            <div key={node.id} style={rowStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, gap: 6 }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, color: '#fff',
                                  background: color, borderRadius: 3,
                                  padding: '1px 5px', flexShrink: 0,
                                  textTransform: 'uppercase',
                                }}>
                                  {operator}
                                </span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#555', fontSize: 12 }}>
                                  {guard ? `[${guard}]` : '(no guard)'}
                                </span>
                              </div>
                              <span
                                title="Delete fragment"
                                style={iconBtn('Delete', () => {}, '#dc3545')}
                                onClick={() => setDeleteTarget({ id: node.id, kind: 'node', displayName: 'fragment' })}
                              >
                                <TrashIcon />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Use-case Diagram Browser ─────────────────────────── */}
            {!isSequence && (
              <div style={{ border: '1.5px solid #222', borderRadius: 8, background: '#fff', marginBottom: 12 }}>
                {sectionHeader('Use Case Diagram', ucOpen, () => setUcOpen((v) => !v))}
                {ucOpen && (
                  <div style={{ padding: '8px 0' }}>
                    {nodes.filter((node) => node.type === 'usecaseshape').map((node) => (
                      <div key={node.id} style={{ ...rowStyle, padding: '8px 16px' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.data.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <span
                            style={{ cursor: 'pointer', lineHeight: 0 }}
                            title="Edit"
                            onClick={() => openModal({ type: String(node.type), label: node.data.label || '', id: String(node.id) })}
                          >
                            <EditIcon />
                          </span>
                          <span
                            style={{ cursor: 'pointer', color: '#dc3545', lineHeight: 0 }}
                            title="Delete"
                            onClick={() => setDeleteTarget({ id: node.id, kind: 'node', displayName: 'use case' })}
                          >
                            <TrashIcon />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete confirmation dialog ──────────────────────────────── */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#333' }}>
            <p>Are you sure you want to delete this {deleteTarget.displayName}?</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ marginRight: '10px', padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '8px 15px', border: 'none', backgroundColor: '#dc3545', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
