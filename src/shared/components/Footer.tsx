import React from 'react';
import '../../App';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      {/* Bottom content goes here */}
      © {currentYear} SAgile Project Management Tool
    </div>
  );
};

export default Footer;
