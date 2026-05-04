import React, { useState } from "react";
import { useDnD } from "../../features/diagram-editing/hooks/useDnD";
import { useEdgeType } from "../../features/diagram-editing/hooks/useEdgeType";
import { nodeFactory } from "../factories/node-factory";
import { assertWithLog } from "../utils/assertWithLog";
import { DiagramType } from "../models/Diagram";
import { FragmentOperator } from "../../features/sequence-diagram-editing/components/SequenceFragmentNode";

interface SidebarProps {
  diagramType?: DiagramType;
}

const Sidebar: React.FC<SidebarProps> = ({ diagramType }) => {
  // Detect diagram type from URL if not provided
  const { pathname } = window.location;
  const currentDiagramType = diagramType || (pathname.includes('/sequence/') ? 'sequence' : 'usecase');

  const { setType, setShapeType } = useDnD();
  const { selectedEdgeType, handleEdgeTypeChange } = useEdgeType();
  const [elementsOpen, setElementsOpen]   = useState(true);
  const [messagesOpen, setMessagesOpen]   = useState(true);
  const [fragmentsOpen, setFragmentsOpen] = useState(true);

  const onDragStart = (
    event: React.DragEvent,
    diagramElementType: string,
    shape: string
  ) => {
    setType(diagramElementType);
    setShapeType(shape);
    event.dataTransfer.effectAllowed = "move";
    // For sequence diagrams, pass the shape type (actor, boundary, control, entity)
    // For use case diagrams, pass the diagramElementType
    event.dataTransfer.setData("application/reactflow", shape);
    const dragImage = document.createElement("div");
    dragImage.style.width = "150px";
    dragImage.style.height = "100px";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.opacity = "0.8";
    dragImage.style.backgroundColor = "white";
    dragImage.style.border = "1px solid #ccc";
    dragImage.style.borderRadius = "5px";
    dragImage.style.padding = "10px";
    dragImage.style.display = "flex";
    dragImage.style.flexDirection = "column";
    dragImage.style.alignItems = "center";
    dragImage.style.justifyContent = "center";
    const nodeContent = event.currentTarget.querySelector(".node-content");
    if (nodeContent) {
      const clone = nodeContent.cloneNode(true) as HTMLElement;
      dragImage.appendChild(clone);
    }
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 75, 50);
    assertWithLog(
      document.body.contains(dragImage),
      "Post-condition failed: dragImage must be added to the DOM.",
      "Post-condition passed: dragImage is in the DOM."
    );
    setTimeout(() => {
      document.body.removeChild(dragImage);
      assertWithLog(
        !document.body.contains(dragImage),
        "Post-condition failed: dragImage must be removed from the DOM.",
        "Post-condition passed: dragImage is removed from the DOM."
      );
    }, 0);
  };

  // Use Case Diagram edge types
  const useCaseEdgeTypes = [
    {
      key: "association",
      label: "Association",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
        </div>
      ),
    },
    {
      key: "extend",
      label: "Extend",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 64 }}>
          <div style={{ flex: 1, borderTop: "2px dashed #222", height: 0, marginRight: 4 }} />
          <span style={{ fontSize: 13, fontStyle: 'italic', whiteSpace: 'nowrap', background: 'transparent' }}>«extend»</span>
        </div>
      ),
    },
    {
      key: "include",
      label: "Include",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 64 }}>
          <div style={{ flex: 1, borderTop: "2px dashed #222", height: 0, marginRight: 4 }} />
          <span style={{ fontSize: 13, fontStyle: 'italic', whiteSpace: 'nowrap', background: 'transparent' }}>«include»</span>
        </div>
      ),
    },
    {
      key: "generalization",
      label: "Generalization",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 64 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginLeft: -8, background: '#fff', borderRadius: 2, zIndex: 1 }}>
            <polygon points="18,9 0,3 0,15" fill="#fff" stroke="#111" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
    {
      key: "composition",
      label: "Composition",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 64 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: -8, background: '#fff', borderRadius: 2, zIndex: 1 }}>
            <polygon points="8,2 14,8 8,14 2,8" fill="#111" stroke="#111" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
    {
      key: "aggregation",
      label: "Aggregation",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 64 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: -8, background: '#fff', borderRadius: 2, zIndex: 1 }}>
            <polygon points="8,2 14,8 8,14 2,8" fill="#fff" stroke="#111" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
  ];

  // Sequence Diagram message types
  const sequenceMessageTypes = [
    {
      key: "synchronous",
      label: "Synchronous",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: -6 }}>
            <polygon points="12,6 0,0 0,12" fill="#222" />
          </svg>
        </div>
      ),
    },
    {
      key: "asynchronous",
      label: "Asynchronous",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px solid #222", height: 0 }} />
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: -6 }}>
            <polygon points="12,6 0,0 0,12" fill="none" stroke="#222" strokeWidth="2" />
          </svg>
        </div>
      ),
    },
    {
      key: "return",
      label: "Return",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px dashed #222", height: 0 }} />
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: -6 }}>
            <polygon points="12,6 0,0 0,12" fill="none" stroke="#222" strokeWidth="2" />
          </svg>
        </div>
      ),
    },
    {
      key: "create",
      label: "Create",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px solid #4CAF50", height: 0 }} />
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: -6 }}>
            <polygon points="12,6 0,0 0,12" fill="#4CAF50" />
          </svg>
        </div>
      ),
    },
    {
      key: "destroy",
      label: "Destroy",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', width: 48 }}>
          <div style={{ flex: 1, borderTop: "2px solid #f44336", height: 0 }} />
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: -6 }}>
            <polygon points="12,6 0,0 0,12" fill="#f44336" />
          </svg>
        </div>
      ),
    },
  ];

  const edgeTypes = currentDiagramType === 'sequence' ? sequenceMessageTypes : useCaseEdgeTypes;

  // ── UML Combined Fragments ─────────────────────────────────────────────────
  const fragmentItems: { operator: FragmentOperator; label: string; description: string; color: string }[] = [
    { operator: 'opt',   label: 'opt',   description: 'Optional',    color: '#555' },
    { operator: 'alt',   label: 'alt',   description: 'Alternative', color: '#555' },
    { operator: 'loop',  label: 'loop',  description: 'Loop',        color: '#555' },
    { operator: 'par',   label: 'par',   description: 'Parallel',    color: '#555' },
    { operator: 'ref',   label: 'ref',   description: 'Reference',   color: '#555' },
    { operator: 'break', label: 'break', description: 'Break',       color: '#555' },
  ];

  const onFragmentDragStart = (event: React.DragEvent, operator: FragmentOperator) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', `fragment-${operator}`);
  };

  return (
    <div
      className="leftsidebar"
      style={{
        padding: "10px 0 10px 0",
        borderRight: "1px solid #ddd",
        height: "100%",
        overflowY: "auto",
        width: 260,
        minWidth: 220,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "0 16px 8px 16px",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2, color: "black"}}>
          {currentDiagramType === 'sequence' ? 'Sequence Diagram' : 'Use Case Diagram'}
        </div>
      </div>
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "calc(100% - 40px)",
        }}
      >
        {/* Elements */}
        <div
          onClick={() => setElementsOpen(o => !o)}
          style={{
            fontWeight: 500,
            fontSize: 13,
            color: '#111',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          <span>{currentDiagramType === 'sequence' ? 'Lifelines' : 'Elements'}</span>
          <span style={{ fontSize: 14 }}>{elementsOpen ? '▾' : '▸'}</span>
        </div>
        {elementsOpen && (
          <div
            style={{
              border: "1px solid #b0b0b0",
              borderRadius: 8,
              background: "#fafbfc",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              overflowY: "auto",
              color: '#111',
            }}
          >
            {currentDiagramType === 'sequence' ? (
              <>
                {nodeFactory.createDraggableNode("sequenceElement", "sequenceactor", onDragStart)}
                {nodeFactory.createDraggableNode("sequenceElement", "boundary", onDragStart)}
                {nodeFactory.createDraggableNode("sequenceElement", "control", onDragStart)}
                {nodeFactory.createDraggableNode("sequenceElement", "entity", onDragStart)}
              </>
            ) : (
              <>
                {nodeFactory.createDraggableNode("usecaseshape", "usecase", onDragStart)}
                {nodeFactory.createDraggableNode("usecaseshape", "actor", onDragStart)}
                {nodeFactory.createDraggableNode("usecaseshape", "rectangularactor", onDragStart)}
                {nodeFactory.createDraggableNode("package", "package", onDragStart)}
              </>
            )}
          </div>
        )}

        {/* Edge/Line Types */}
        <div
          onClick={() => setMessagesOpen(o => !o)}
          style={{
            fontWeight: 500,
            fontSize: 13,
            color: '#111',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          <span>{currentDiagramType === 'sequence' ? 'Messages' : 'Edges/Relations'}</span>
          <span style={{ fontSize: 14 }}>{messagesOpen ? '▾' : '▸'}</span>
        </div>
        {messagesOpen && (
          <div
            style={{
              border: "1px solid #b0b0b0",
              borderRadius: 8,
              background: "#fafbfc",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              overflowY: "auto",
              color: '#111',
            }}
          >
            {edgeTypes.map((edge) => (
              <div
                key={edge.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "2px 0",
                  color: '#111',
                  cursor: 'pointer',
                }}
                onClick={() => handleEdgeTypeChange(edge.key as Parameters<typeof handleEdgeTypeChange>[0])}
              >
                <input
                  type="radio"
                  name="edgeType"
                  checked={selectedEdgeType === edge.key}
                  onChange={() => handleEdgeTypeChange(edge.key as Parameters<typeof handleEdgeTypeChange>[0])}
                  style={{ margin: 0 }}
                />
                {edge.icon}
                <span style={{ fontSize: 14, color: '#111', whiteSpace: 'nowrap' }}>{edge.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Fragments (sequence diagrams only) ──────────────────── */}
        {currentDiagramType === 'sequence' && (
          <>
            <div
              onClick={() => setFragmentsOpen(o => !o)}
              style={{
                fontWeight: 500,
                fontSize: 13,
                color: '#111',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
                marginBottom: 0,
              }}
            >
              <span>Fragments</span>
              <span style={{ fontSize: 14 }}>{fragmentsOpen ? '▾' : '▸'}</span>
            </div>

            {fragmentsOpen && (
              <div
                style={{
                  border: '1px solid #b0b0b0',
                  borderRadius: 8,
                  background: '#fafbfc',
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  overflowY: 'auto',
                  color: '#111',
                }}
              >
                {fragmentItems.map(({ operator, label, description, color }) => (
                  <div
                    key={operator}
                    draggable
                    onDragStart={e => onFragmentDragStart(e, operator)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '6px 8px',
                      border: `1.5px solid ${color}`,
                      borderRadius: 4,
                      background: '#fff',
                      cursor: 'grab',
                      userSelect: 'none',
                    }}
                  >
                    {/* Mini pentagon preview */}
                    <svg width="36" height="24" viewBox="0 0 36 24" style={{ flexShrink: 0 }}>
                      <rect x="1" y="1" width="34" height="22" rx="1" fill="rgba(255,255,255,0.6)" stroke={color} strokeWidth="1.5" />
                      {/* Pentagon label box */}
                      <polygon points="1,1 18,1 22,12 18,23 1,23" fill={color} />
                      <text x="5" y="15" fontSize="7" fontWeight="bold" fill="#fff" fontFamily="Arial">{label}</text>
                    </svg>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{label}</span>
                      <span style={{ fontSize: 11, color: '#888' }}>{description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
