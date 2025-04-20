import { assertWithLog } from "../../../shared/utils/assertWithLog";
import { Node, Edge, getConnectedEdges } from "@xyflow/react";

type GraphNode = {
  id: string;
  selected: boolean;
  position: { x: number; y: number };
  type?: string;
  data?: any;
};
type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: any;
};

class GraphEditor<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private bufferedNodes: GraphNode[] = [];
  private bufferedEdges: GraphEdge[] = [];
  private originalNodes: NodeType[] = [];
  private originalEdges: EdgeType[] = [];

  constructor(nodes: NodeType[], edges: EdgeType[]) {
    // Store original nodes and edges for reference
    this.originalNodes = nodes;
    this.originalEdges = edges;

    // Convert React Flow nodes to GraphNodes
    this.nodes = nodes.map((node) => ({
      id: node.id,
      selected: node.selected || false,
      position: node.position,
      type: node.type,
      data: node.data,
    }));

    // Convert React Flow edges to GraphEdges
    this.edges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      data: edge.data,
    }));

    // Pre-condition: Ensure nodes and edges are valid arrays
    assertWithLog(
      Array.isArray(this.nodes) && Array.isArray(this.edges),
      "GRAPH EDITOR (PS3 SC): Pre-condition failed: Nodes and edges must be arrays.",
      "GRAPH EDITOR (PS3 SC): Pre-condition passed: Nodes and edges are valid arrays."
    );

    // Pre-condition: Ensure all nodes have required properties
    assertWithLog(
      this.nodes.every((node) => node.id && typeof node.selected === "boolean"),
      "GRAPH EDITOR (PS3 SC): Pre-condition failed: All nodes must have id and selected properties.",
      "GRAPH EDITOR (PS3 SC): Pre-condition passed: All nodes have required properties."
    );

    // Pre-condition: Ensure all edges have required properties
    assertWithLog(
      this.edges.every((edge) => edge.id && edge.source && edge.target),
      "GRAPH EDITOR (PS3 SC): Pre-condition failed: All edges must have id, source, and target properties.",
      "GRAPH EDITOR (PS3 SC): Pre-condition passed: All edges have required properties."
    );

    // Invariant: Ensure graph state is valid after initialization
    this.validateGraphState();
  }

  // Getter methods for React Flow integration
  public getNodes(): NodeType[] {
    return this.nodes.map((node) => {
      // Find the original node to preserve its properties
      const originalNode = this.originalNodes.find((n) => n.id === node.id);
      return {
        ...originalNode,
        id: node.id,
        selected: node.selected,
        position: node.position,
        type: node.type,
        data: node.data,
      } as NodeType;
    });
  }

  public getEdges(): EdgeType[] {
    return this.edges.map((edge) => {
      // Find the original edge to preserve its properties
      const originalEdge = this.originalEdges.find((e) => e.id === edge.id);
      return {
        ...originalEdge,
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data,
      } as EdgeType;
    });
  }

  public getBuffered(): { nodes: NodeType[]; edges: EdgeType[] } {
    return {
      nodes: this.bufferedNodes.map((node) => {
        // Find the original node to preserve its properties
        const originalNode = this.originalNodes.find((n) => n.id === node.id);
        return {
          ...originalNode,
          id: node.id,
          selected: node.selected,
          position: node.position,
          type: node.type,
          data: node.data,
        } as NodeType;
      }),
      edges: this.bufferedEdges.map((edge) => {
        // Find the original edge to preserve its properties
        const originalEdge = this.originalEdges.find((e) => e.id === edge.id);
        return {
          ...originalEdge,
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          data: edge.data,
        } as EdgeType;
      }),
    };
  }

  // Process: Cut selected nodes and edges
  public cut(): void {
    console.log("Executing cut operation...");

    // Pre-condition: Ensure there are selected nodes
    this.ensureSelectedNodes();

    // Filter selected nodes
    const selectedNodes = this.nodes.filter((node) => node.selected);

    // Get connected edges using the same logic as getConnectedEdges
    const selectedEdges = this.edges.filter((edge) => {
      const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
      const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);
      return !(isExternalSource || isExternalTarget);
    });

    // Pre-condition: Ensure selected edges are valid
    assertWithLog(
      selectedEdges.every((edge) => edge.source && edge.target),
      "GRAPH EDITOR (PS3 SC): Pre-condition failed: All selected edges must have valid source and target.",
      "GRAPH EDITOR (PS3 SC): Pre-condition passed: All selected edges have valid source and target."
    );

    // Store the original state for post-conditions
    const originalNodes = [...this.nodes];
    const originalEdges = [...this.edges];

    // Buffer the selected nodes and edges
    this.bufferedNodes = [...selectedNodes];
    this.bufferedEdges = [...selectedEdges];
    console.log("Buffered Nodes:", this.bufferedNodes);
    console.log("Buffered Edges:", this.bufferedEdges);

    // Remove selected nodes and edges from the graph
    this.nodes = this.nodes.filter((node) => !node.selected);
    this.edges = this.edges.filter((edge) => !selectedEdges.includes(edge));

    // Post-condition: Ensure selected nodes are removed
    assertWithLog(
      this.nodes.every((node) => !node.selected),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Selected nodes were not removed.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Selected nodes were successfully removed."
    );

    // Post-condition: Ensure selected edges are removed
    assertWithLog(
      selectedEdges.every((edge) => !this.edges.includes(edge)),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Selected edges were not removed.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Selected edges were successfully removed."
    );

    // Post-condition: Ensure non-selected nodes remain unchanged
    assertWithLog(
      originalNodes
        .filter((node) => !node.selected)
        .every((node) => this.nodes.some((n) => n.id === node.id)),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Non-selected nodes were modified.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Non-selected nodes remain unchanged."
    );

    // Post-condition: Ensure non-selected edges remain unchanged
    assertWithLog(
      originalEdges
        .filter((edge) => !selectedEdges.includes(edge))
        .every((edge) => this.edges.some((e) => e.id === edge.id)),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Non-selected edges were modified.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Non-selected edges remain unchanged."
    );

    // Post-condition: Ensure buffered nodes match selected nodes
    assertWithLog(
      this.bufferedNodes.length === selectedNodes.length &&
        this.bufferedNodes.every((node) =>
          selectedNodes.some((n) => n.id === node.id)
        ),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Buffered nodes do not match selected nodes.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Buffered nodes match selected nodes."
    );

    // Post-condition: Ensure buffered edges match selected edges
    assertWithLog(
      this.bufferedEdges.length === selectedEdges.length &&
        this.bufferedEdges.every((edge) =>
          selectedEdges.some((e) => e.id === edge.id)
        ),
      "GRAPH EDITOR (PS3 SC): Post-condition failed: Buffered edges do not match selected edges.",
      "GRAPH EDITOR (PS3 SC): Post-condition passed: Buffered edges match selected edges."
    );

    // Invariant: Ensure graph state is still valid after cut
    this.validateGraphState();

    console.log("Cut operation completed successfully.");
  }

  // Invariant: Ensure graph state is valid
  private validateGraphState(): void {
    // Check for duplicate node IDs
    const uniqueNodeIds = new Set(this.nodes.map((node) => node.id));
    assertWithLog(
      uniqueNodeIds.size === this.nodes.length,
      "GRAPH EDITOR (PS3 SC): Invariant failed: Node IDs must be unique.",
      "GRAPH EDITOR (PS3 SC): Invariant passed: All node IDs are unique."
    );
  }

  // Pre-condition: Ensure there are selected nodes
  private ensureSelectedNodes(): void {
    assertWithLog(
      this.nodes.some((node) => node.selected),
      "GRAPH EDITOR (PS3 SC): Pre-condition failed: No nodes are selected.",
      "GRAPH EDITOR (PS3 SC): Pre-condition passed: At least one node is selected."
    );
  }
}

export default GraphEditor;
