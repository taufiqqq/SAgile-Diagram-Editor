import React from 'react';
import { UseCaseTab } from '../../diagram-editing/types/UseCaseTypes';

interface UseCaseTabNavProps {
  activeTab: UseCaseTab;
  onTabChange: (tab: UseCaseTab) => void;
}

const TABS: UseCaseTab[] = ['Details', 'Specifications', 'Others'];

export const UseCaseTabNav: React.FC<UseCaseTabNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div style={{ padding: "16px 0" }}>
      {TABS.map((tab) => (
        <div
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: "12px 24px",
            cursor: "pointer",
            color: activeTab === tab ? "#000" : "#666",
            backgroundColor: activeTab === tab ? "#f3f4f6" : "transparent",
            fontSize: "14px",
            fontWeight: activeTab === tab ? 600 : 400,
            transition: "all 0.2s ease",
            borderLeft: activeTab === tab ? "3px solid #000" : "3px solid transparent",
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}; 