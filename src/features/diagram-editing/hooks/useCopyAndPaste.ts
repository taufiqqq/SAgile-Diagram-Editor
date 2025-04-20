import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Node,
  useKeyPress,
  useReactFlow,
  getConnectedEdges,
  Edge,
  XYPosition,
  useStore,
  type KeyCode,
} from '@xyflow/react';
import { assertWithLog } from '../../../shared/utils/assertWithLog';

export function useCopyPaste<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>(takeSnapshot?: () => void) {
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 });
  const rfDomNode = useStore((state) => state.domNode);

  const { getNodes, setNodes, getEdges, setEdges, screenToFlowPosition } =
    useReactFlow<NodeType, EdgeType>();

  // Set up the paste buffers to store the copied nodes and edges.
  const [bufferedNodes, setBufferedNodes] = useState([] as NodeType[]);
  const [bufferedEdges, setBufferedEdges] = useState([] as EdgeType[]);

  // initialize the copy/paste hook
  // 1. remove native copy/paste/cut handlers
  // 2. add mouse move handler to keep track of the current mouse position
  useEffect(() => {
    const events = ['cut', 'copy', 'paste'];

    if (rfDomNode) {
      const preventDefault = (e: Event) => e.preventDefault();

      const onMouseMove = (event: MouseEvent) => {
        mousePosRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      };

      for (const event of events) {
        rfDomNode.addEventListener(event, preventDefault);
      }

      rfDomNode.addEventListener('mousemove', onMouseMove);

      return () => {
        for (const event of events) {
          rfDomNode.removeEventListener(event, preventDefault);
        }

        rfDomNode.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [rfDomNode]);

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
      (edge) => {
        const isExternalSource = selectedNodes.every(
          (n) => n.id !== edge.source
        );
        const isExternalTarget = selectedNodes.every(
          (n) => n.id !== edge.target
        );

        return !(isExternalSource || isExternalTarget);
      }
    );

    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
  }, [getNodes, getEdges]);

  const cut = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter(
      (edge) => {
        const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
        const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);
  
        return !(isExternalSource || isExternalTarget);
      }
    );
  
    // Pre-condition: Ensure there are selected nodes
    assertWithLog(
      selectedNodes.length > 0,
      'Pre-condition failed: No nodes are selected.',
      'Pre-condition passed: At least one node is selected.'
    );
  
    // Pre-condition: Ensure getEdges returns valid edges
    const edges = getEdges();
    assertWithLog(
      Array.isArray(edges),
      'Pre-condition failed: Edges must be an array.',
      'Pre-condition passed: Edges are valid.'
    );
  
    // Invariant: Ensure selectedEdges are valid
    assertWithLog(
      selectedEdges.every((edge) => edge.source && edge.target),
      'Invariant failed: All selected edges must have valid source and target.',
      'Invariant passed: All selected edges have valid source and target.'
    );
  
    // Buffer the selected nodes and edges
    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
  
    // Take a snapshot of the current state
    if (takeSnapshot) takeSnapshot();
  
    // Remove selected nodes and edges from the graph
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !selectedEdges.includes(edge)));
  
    // Post-condition: Ensure selected nodes are removed
    setNodes((nodes) => {
      const updatedNodes = nodes.filter((node) => !node.selected);
      assertWithLog(
        updatedNodes.every((node: NodeType) => !node.selected),
        'Post-condition failed: Selected nodes were not removed.',
        'Post-condition passed: Selected nodes were successfully removed.'
      );
      return updatedNodes;
    });
  
    // Post-condition: Ensure selected edges are removed
    const updatedEdges = getEdges();
    assertWithLog(
      selectedEdges.every((edge) => !updatedEdges.includes(edge)),
      'Post-condition failed: Selected edges were not removed.',
      'Post-condition passed: Selected edges were successfully removed.'
    );
  }, [getNodes, setNodes, getEdges, setEdges, takeSnapshot]);

  const paste = useCallback(
    (
      { x: pasteX, y: pasteY } = screenToFlowPosition({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
      })
    ) => {
      const minX = Math.min(...bufferedNodes.map((s) => s.position.x));
      const minY = Math.min(...bufferedNodes.map((s) => s.position.y));

      const now = Date.now();

      const newNodes: NodeType[] = bufferedNodes.map((node) => {
        const id = `${node.id}-${now}`;
        const x = pasteX + (node.position.x - minX);
        const y = pasteY + (node.position.y - minY);

        return { ...node, id, position: { x, y } };
      });

      const newEdges: EdgeType[] = bufferedEdges.map((edge) => {
        const id = `${edge.id}-${now}`;
        const source = `${edge.source}-${now}`;
        const target = `${edge.target}-${now}`;

        return { ...edge, id, source, target };
      });

      if (takeSnapshot) takeSnapshot();
      setNodes((nodes) => [
        ...nodes.map((node) => ({ ...node, selected: false })),
        ...newNodes,
      ]);
      setEdges((edges) => [
        ...edges.map((edge) => ({ ...edge, selected: false })),
        ...newEdges,
      ]);
    },
    [bufferedNodes, bufferedEdges, screenToFlowPosition, setNodes, setEdges, takeSnapshot]
  );

  useShortcut(['Meta+x', 'Control+x'], cut);
  useShortcut(['Meta+c', 'Control+c'], copy);
  useShortcut(['Meta+v', 'Control+v'], paste);

  return { cut, copy, paste, bufferedNodes, bufferedEdges };
}

function useShortcut(keyCode: KeyCode, callback: Function): void {
  const [didRun, setDidRun] = useState(false);
  const shouldRun = useKeyPress(keyCode);

  useEffect(() => {
    if (shouldRun && !didRun) {
      callback();
      setDidRun(true);
    } else {
      setDidRun(shouldRun);
    }
  }, [shouldRun, didRun, callback]);
}

export default useCopyPaste;
