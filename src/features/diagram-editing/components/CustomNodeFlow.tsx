import {Panel, ReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from '../styles.module.css';
import { useFlowState } from '../hooks/useFlowState';
import { useFlowHandlers } from '../hooks/useFlowHandlers';
import { FlowControls } from './FlowControl';
import { nodeTypes } from '../types/NodeTypes.types';

export default function CustomNodeFlow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    cut, 
    copy, 
    paste, 
    bufferedNodes
  } = useFlowState();

  const { onConnect, onDragOver, onDrop } = useFlowHandlers({
    setNodes,
    setEdges
  });

  //TODO: recheck issit correct to put in this file or better in other file
  const canCopy = nodes.some(({ selected }) => selected);
  const canPaste = bufferedNodes.length > 0;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={(event) => {
        const newNode = onDrop(event);
        if (newNode) {
          setNodes(nds => nds.concat(newNode));
        }
      }}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <FlowControls />
      {/* <Panel className={styles.buttonGroup} position="top-left">
        <button
          className={styles.button}
          onClick={() => cut()}
          disabled={!canCopy}
        >
          cut
        </button>
        <button
          className={styles.button}
          onClick={() => copy()}
          disabled={!canCopy}
        >
          copy
        </button>
        <button
          className={styles.button}
          onClick={() => paste({ x: 0, y: 0 })}
          disabled={!canPaste}
        >
          paste
        </button>
      </Panel> */}
    </ReactFlow>
  );
}