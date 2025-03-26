import React, { useCallback } from 'react';
import { useStore } from '@xyflow/react';
import { Node } from '@xyflow/react'; // Import Node type if needed

interface RightSidebarProps {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
}

const transformSelector = (state: any) => state.transform;

const RightSidebar: React.FC<RightSidebarProps> = ({ nodes, setNodes }) => {
  const transform = useStore(transformSelector);

  const selectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
  }, [setNodes]);

  return (
    <div className="rightsidebar">
      <div className="description">
        This is an example of how you can access the internal state outside of
        the ReactFlow component.
      </div>
      <div className="title">Zoom & pan transform</div>
      <div className="transform">
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)},{' '}
        {transform[2].toFixed(2)}]
      </div>
      <div className="title">Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.position.x.toFixed(2)}, y:{' '}
          {node.position.y.toFixed(2)}
        </div>
      ))}

      <div className="selectall">
        <button onClick={selectAll}>select all nodes</button>
      </div>
    </div>
  );
};

export default RightSidebar;