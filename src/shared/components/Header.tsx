import React from 'react';
import '../../App';
import '../../App.css';
import { DiagramTypeSwitcher } from './DiagramTypeSwitcher';
import { DiagramType } from '../models/Diagram';

interface HeaderProps {
  onExportImage?: () => void;
  diagramType?: DiagramType;
}

const Header: React.FC<HeaderProps> = ({ onExportImage, diagramType = 'usecase' }) => {
  return (
    <div className="header">
      {/* Title at the top */}
      <div className="header-title">
        SAgile Diagram Editor
        <div style={{ marginLeft: '20px', display: 'inline-block' }}>
          <DiagramTypeSwitcher currentType={diagramType} />
        </div>
      </div>
      {/* Menu bar at the bottom left */}
      <div className="header-bottom-left">
        <div className="menu-bar">
          {/* <div className="menu-item">File</div> */}
          {/* <div className="menu-item">Edit</div> */}
          {/* <div className="menu-item">View</div> */}
          <div className="menu-item export-menu">
            Export
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={onExportImage}>Image</div>
            </div>
          </div>
          {/* <div className="menu-item">Save To Database</div> */}
            <div
            className="menu-item"
            onClick={() => window.open('https://sagile.software/', '_blank')}
            >
            Help
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
