import React from 'react';
import CustomNodeFlow from '../controller/CustomNodeFlow'; // Adjust the import path as necessary
import '../App.css';

const CanvasContainer: React.FC = () => {
  return (
    <div className="canvas">
      <CustomNodeFlow />
    </div>
  );
};

export default CanvasContainer;
