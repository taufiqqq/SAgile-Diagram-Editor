import React, { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";
import { UseCaseTabNav } from "../../features/project-browser/modal/UseCaseTabNav";
import { UseCaseData, UseCaseTab, DEFAULT_USE_CASE } from "../../features/diagram-editing/types/UseCaseTypes";
import { UseCaseDetailsForm } from "../../features/project-browser/modal/UseCaseDetailsForm";
import { UseCaseSpecifications } from "../../features/project-browser/modal/UseCaseSpecifications";

interface FlowStep {
  id: string;
  description: string;
}

interface SequenceFlow {
  id: string;
  type: 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: FlowStep[];
}

interface SpecificationsData {
  preconditions: string[];
  postconditions: string[];
  flows: SequenceFlow[];
}

const initialNormalFlow: SequenceFlow = {
  id: 'normal',
  type: 'NORMAL',
  name: 'Normal flow',
  steps: [{ id: 'step-1', description: '' }],
};

export const UseCaseModal: React.FC = () => {
  const { isOpen, nodeData, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<UseCaseTab>('Details');
  const [useCaseData, setUseCaseData] = useState<UseCaseData>(DEFAULT_USE_CASE);
  const [specifications, setSpecifications] = useState<SpecificationsData>({
    preconditions: [''],
    postconditions: [''],
    flows: [initialNormalFlow]
  });

  // Initialize state when modal opens
  useEffect(() => {
    if (nodeData) {
      setUseCaseData({
        ...DEFAULT_USE_CASE,
        id: nodeData.id,
        name: nodeData.label || '',
      });
      
      // Reset specifications when modal opens
      setSpecifications({
        preconditions: [''],
        postconditions: [''],
        flows: [initialNormalFlow]
      });
    }
  }, [nodeData]);

  const handleDataChange = (changes: Partial<UseCaseData>) => {
    setUseCaseData(prev => ({
      ...prev,
      ...changes,
      modified: new Date().toLocaleString(),
    }));
  };

  const handleSpecificationsChange = (changes: Partial<SpecificationsData>) => {
    setSpecifications(prev => ({
      ...prev,
      ...changes
    }));
  };

  if (!isOpen || !nodeData) return null;

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
              specifications={specifications}
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
            useCaseData={{
              name: useCaseData.name,
              id: useCaseData.id,
              description: useCaseData.description,
              version: useCaseData.version
            }}
          />
        </div>
      </div>
    </div>
  );
};
