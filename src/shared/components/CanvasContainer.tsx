import React from 'react';
import CustomNodeFlow from '../../features/diagram-editing/components/CustomNodeFlow';

const CanvasContainer: React.FC = () => {
  return (
    <div className="canvas">
      <CustomNodeFlow />
    </div>
  );
};

export default CanvasContainer;
