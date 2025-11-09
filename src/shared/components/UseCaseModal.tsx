import React, { useState, useEffect } from "react";
import { useModal } from "../context/ModalContext";
import { UseCaseTabNav } from "../../features/project-browser/modal/UseCaseTabNav";
import { UseCaseData, UseCaseTab, DEFAULT_USE_CASE } from "../../features/diagram-editing/types/UseCaseTypes";
import { UseCaseDetailsForm } from "../../features/project-browser/modal/UseCaseDetailsForm";
import { UseCaseSpecifications } from "../../features/project-browser/modal/UseCaseSpecifications";
import { DiagramComponentService } from "../../backend/services/DiagramComponentRepositoryService";
import { DiagramUseCaseSpecificationService } from "../../backend/services/DiagramUseCaseSpecificationService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useParams<{ projectId: string;}>();

  // Initialize state when modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (nodeData && projectId) {
        setIsLoading(true);
        setError(null);
        console.log("nodeData", nodeData);
        try {
          const diagramId = `${projectId}`;
          // First try to find existing component
          const existingComponent = await DiagramComponentService.getComponent(nodeData.id, diagramId);
          
          if (existingComponent) {
            // Update use case data with existing component
            setUseCaseData({
              ...DEFAULT_USE_CASE,
              id: existingComponent.id,
              name: existingComponent.name,
              description: existingComponent.description || '',
              version: existingComponent.version || ''
            });

            // Update specifications with preconditions and postconditions
            setSpecifications(prev => ({
              ...prev,
              preconditions: existingComponent.preconditions && existingComponent.preconditions.length > 0 ? existingComponent.preconditions : [''],
              postconditions: existingComponent.postconditions && existingComponent.postconditions.length > 0 ? existingComponent.postconditions : ['']
            }));

            // Fetch flows
            const flows = await DiagramUseCaseSpecificationService.getSpecificationsByUseCaseId(existingComponent.id);
            if (flows && flows.length > 0) {
              // Transform the flows into the correct format
              const transformedFlows = flows.map(flow => ({
                id: flow.id,
                type: flow.type,
                name: flow.name || (flow.type === 'NORMAL' ? 'Normal flow' : flow.type === 'ALTERNATIVE' ? 'Alternative flow' : 'Exception flow'),
                entry_point: flow.entry_point || '',
                exit_point: flow.exit_point || '',
                steps: flow.steps || []
              }));

              setSpecifications(prev => ({
                ...prev,
                flows: transformedFlows
              }));
            } else {
              // If no flows found, ensure we have at least the initial normal flow
              setSpecifications(prev => ({
                ...prev,
                flows: [initialNormalFlow]
              }));
            }
          } else {
            // If no existing component, just set the initial data
            setUseCaseData({
              ...DEFAULT_USE_CASE,
              id: nodeData.id,
              name: nodeData.label || '',
            });
            
            setSpecifications({
              preconditions: [''],
              postconditions: [''],
              flows: [initialNormalFlow]
            });
          }
        } catch (error) {
          console.error('Error fetching use case data:', error);
          setError('Failed to load use case data. Please try again.');
          toast.error('Failed to load use case data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [nodeData, projectId]);

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

  if (isLoading) {
    return (
      <div style={{
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
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div>Loading use case data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
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
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</div>
        <button
          onClick={closeModal}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    );
  }

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
              useCaseId={nodeData.id}
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
              useCaseId: useCaseData.id,
              nodeId: nodeData.id,
              description: useCaseData.description,
              version: useCaseData.version,
            }}
            specifications={specifications}
          />
        </div>
      </div>
    </div>
  );
};
