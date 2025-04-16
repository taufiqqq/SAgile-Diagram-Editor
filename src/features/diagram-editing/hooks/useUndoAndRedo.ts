import { useCallback, useEffect, useState } from 'react';
import { Edge, Node, useReactFlow } from '@xyflow/react';

type UseUndoRedoOptions = {
  maxHistorySize: number;
  enableShortcuts: boolean;
};

type UseUndoRedo = (options?: UseUndoRedoOptions) => {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

type HistoryItem = {
  nodes: Node[];
  edges: Edge[];
};

const defaultOptions: UseUndoRedoOptions = {
  maxHistorySize: 100,
  enableShortcuts: true,
};

// https://redux.js.org/usage/implementing-undo-history
export const useUndoRedo: UseUndoRedo = ({
  maxHistorySize = defaultOptions.maxHistorySize,
  enableShortcuts = defaultOptions.enableShortcuts,
} = defaultOptions) => {
  // the past and future arrays store the states that we can jump to
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  const takeSnapshot = useCallback(() => {
    const currentState = { nodes: getNodes(), edges: getEdges() };
    setPast((past) => {
      const newPast = [...past, currentState];
      if (newPast.length > maxHistorySize) {
        return newPast.slice(1);
      }
      return newPast;
    });
    setFuture([]);
  }, [getNodes, getEdges, maxHistorySize]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const currentState = { nodes: getNodes(), edges: getEdges() };
    const previousState = past[past.length - 1];
    
    setPast((past) => past.slice(0, -1));
    setFuture((future) => [currentState, ...future]);
    
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
  }, [setNodes, setEdges, getNodes, getEdges, past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const currentState = { nodes: getNodes(), edges: getEdges() };
    const nextState = future[0];
    
    setPast((past) => [...past, currentState]);
    setFuture((future) => future.slice(1));
    
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  }, [setNodes, setEdges, getNodes, getEdges, future]);

  useEffect(() => {
    // this effect is used to attach the global event handlers
    if (!enableShortcuts) {
      return;
    }

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'y' && (event.ctrlKey || event.metaKey)) {
        redo();
      } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [undo, redo, enableShortcuts]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};

export default useUndoRedo;
