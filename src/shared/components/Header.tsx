import React from 'react';
import '../../App';
import '../../App.css';

interface HeaderProps {
  onExportImage?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExportImage }) => {
  return (
    <div className="header">
      {/* Title at the top */}
      <div className="header-title">
        SAgile Diagram Editor
      </div>
      {/* Menu bar at the bottom left */}
      <div className="header-bottom-left">
        <div className="menu-bar">
          <div className="menu-item">File</div>
          <div className="menu-item">Edit</div>
          <div className="menu-item">View</div>
          <div className="menu-item export-menu">
            Export
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={onExportImage}>Image</div>
            </div>
          </div>
          <div className="menu-item">Save To Database</div>
          <div className="menu-item">Help</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
