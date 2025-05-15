import React from 'react';
import { UseCaseTab } from '../../diagram-editing/types/UseCaseTypes';
import { useReactFlow } from '@xyflow/react';
import { useModal } from '../../../shared/context/ModalContext';
import { useParams } from 'react-router-dom';
import { saveDiagramData } from '../../diagram-editing/services/diagramApiService';
import { toast } from 'react-toastify';
import { ParsedEdge, ShapeNode } from '../../diagram-editing/types';
import { DiagramComponentService } from '../../../backend/services/DiagramComponentRepositoryService';

interface UseCaseTabNavProps {
  activeTab: UseCaseTab;
  onTabChange: (tab: UseCaseTab) => void;
  useCaseData: {
    name: string;
    id: string;
    description?: string;
    version?: string;
  };
}

const TABS: UseCaseTab[] = ['Details', 'Specifications', 'Others'];

export const UseCaseTabNav: React.FC<UseCaseTabNavProps> = ({
  activeTab,
  onTabChange,
  useCaseData,
}) => {
  const { setNodes, getNodes, getEdges } = useReactFlow<ShapeNode, ParsedEdge>();
  const { closeModal } = useModal();
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();

  const handleSave = async () => {
    try {
      // Update the node data
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === useCaseData.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: useCaseData.name
              }
            };
          }
          return node;
        })
      );

      // Save the diagram data
      if (projectId && sprintId) {
        // Save the diagram component data
        await DiagramComponentService.getOrCreateComponent(
          useCaseData.id,
          `${projectId}-${sprintId}`,
          {
            name: useCaseData.name,
            description: useCaseData.description || null,
            version: useCaseData.version || null,
            deletable: true
          }
        );

        // Save the diagram data
        await saveDiagramData(projectId, sprintId, getNodes(), getEdges());
        toast.success('Changes saved successfully');
        closeModal();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  return (
    <div style={{ 
      padding: "16px 0",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div>
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

      <div style={{ padding: "16px 24px" }}>
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}; 