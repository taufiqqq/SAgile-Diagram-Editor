import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';

interface FlowStore {
  nodes: Node[];
  edges: Edge[];
  setNodes: (update: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (update: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
}

export const useFlowStore = create<FlowStore>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (update) => {
    if (typeof update === 'function') {
      set((state) => ({ nodes: update(state.nodes) }));
    } else {
      set({ nodes: update });
    }
  },
  setEdges: (update) => {
    if (typeof update === 'function') {
      set((state) => ({ edges: update(state.edges) }));
    } else {
      set({ edges: update });
    }
  },
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        const change = changes.find((c) => c.type === node.type);
        return change ? { ...node, ...change } : node;
      })
    }));
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: state.edges.map((edge) => {
        const change = changes.find((c) => c.id === edge.id);
        return change ? { ...edge, ...change } : edge;
      })
    }));
  }
}));