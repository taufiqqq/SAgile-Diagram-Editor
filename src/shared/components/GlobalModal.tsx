import React, { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";
import { UseCaseTabNav } from "../../features/diagram-editing/components/modal/UseCaseTabNav";
import { UseCaseDetailsForm } from "../../features/diagram-editing/components/modal/UseCaseDetailsForm";
import { UseCaseSpecifications } from "../../features/diagram-editing/components/modal/UseCaseSpecifications";
import { UseCaseData, UseCaseTab, DEFAULT_USE_CASE } from "../../features/diagram-editing/types/UseCaseTypes";

interface SpecificationsMap {
  [useCaseId: string]: string[];
}

export const GlobalModal: React.FC = () => {
  const { isOpen, nodeData, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<UseCaseTab>('Details');
  const [useCaseData, setUseCaseData] = useState<UseCaseData>(DEFAULT_USE_CASE);
  const [specificationsMap, setSpecificationsMap] = useState<SpecificationsMap>({});

  useEffect(() => {
    if (nodeData) {
      setUseCaseData({
        ...DEFAULT_USE_CASE,
        id: nodeData.id,
        name: nodeData.label || '',
      });
      
      // Initialize specifications for this use case if not exists
      if (!specificationsMap[nodeData.id]) {
        setSpecificationsMap(prev => ({
          ...prev,
          [nodeData.id]: ['']
        }));
      }
    }
  }, [nodeData]);

  const handleDataChange = (changes: Partial<UseCaseData>) => {
    setUseCaseData(prev => ({
      ...prev,
      ...changes,
      modified: new Date().toLocaleString(),
    }));
  };

  const handleSpecificationsChange = (newSpecs: string[]) => {
    if (!nodeData) return;
    
    setSpecificationsMap(prev => ({
      ...prev,
      [nodeData.id]: newSpecs
    }));
  };

  if (!isOpen || !nodeData) return null;

  const currentSpecifications = specificationsMap[nodeData.id] || [''];

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999999,
        width: "800px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px, rgba(0, 0, 0, 0.05) 0px 1px 4px",
        color: "#000000",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 32px",
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "white",
          flexShrink: 0
        }}
      >
        <h2 style={{ 
          fontSize: "18px", 
          fontWeight: 600,
          color: "#111827"
        }}>
          {useCaseData.name || 'Use Case Details'}
        </h2>
        <button
          onClick={closeModal}
          style={{
            fontSize: "24px",
            color: "#9ca3af",
            cursor: "pointer",
            border: "none",
            background: "none",
            padding: "4px",
            lineHeight: "1",
            transition: "color 0.2s ease",
            marginRight: "-8px"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#4b5563"}
          onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        display: "flex", 
        flex: 1,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          marginRight: "160px",
          overflowY: "auto",
          height: "100%"
        }}>
          {activeTab === 'Details' && (
            <UseCaseDetailsForm
              data={useCaseData}
              onChange={handleDataChange}
            />
          )}
          {activeTab === 'Specifications' && (
            <UseCaseSpecifications
              specifications={currentSpecifications}
              onChange={handleSpecificationsChange}
            />
          )}
          {activeTab === 'Others' && (
            <div style={{ padding: "24px 32px" }}>
              <p style={{ color: "#6b7280", fontStyle: "italic", fontSize: "14px" }}>
                Other content coming soon...
              </p>
            </div>
          )}
        </div>

        {/* Right Navigation */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "160px",
          borderLeft: "1px solid #f3f4f6",
          backgroundColor: "white",
          flexShrink: 0
        }}>
          <UseCaseTabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};
