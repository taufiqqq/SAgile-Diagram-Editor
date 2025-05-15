import React from 'react';
import { UseCaseTab } from '../../diagram-editing/types/UseCaseTypes';
import { useReactFlow } from '@xyflow/react';
import { useModal } from '../../../shared/context/ModalContext';
import { useParams } from 'react-router-dom';
import { saveDiagramData } from '../../diagram-editing/services/diagramApiService';
import { toast } from 'react-toastify';
import { ParsedEdge, ShapeNode } from '../../diagram-editing/types';
import { DiagramComponentService } from '../../../backend/services/DiagramComponentRepositoryService';
import { DiagramUseCaseSpecificationService } from '../../../backend/services/DiagramUseCaseSpecificationService';

interface UseCaseTabNavProps {
  activeTab: UseCaseTab;
  onTabChange: (tab: UseCaseTab) => void;
  useCaseData: {
    name: string;
    useCaseId: string;
    nodeId: string;
    description?: string;
    version?: string;
  };
  specifications?: {
    preconditions: string[];
    postconditions: string[];
    flows: Array<{
      id: string;
      type: 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';
      name: string;
      entry_point?: string;
      exit_point?: string;
      steps: Array<{
        id: string;
        description: string;
      }>;
    }>;
  };
}

const TABS: UseCaseTab[] = ['Details', 'Specifications', 'Others'];

export const UseCaseTabNav: React.FC<UseCaseTabNavProps> = ({
  activeTab,
  onTabChange,
  useCaseData,
  specifications
}) => {
  const { setNodes, getNodes, getEdges } = useReactFlow<ShapeNode, ParsedEdge>();
  const { closeModal } = useModal();
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();

  const handleSave = async () => {
    try {
      if (!projectId || !sprintId) {
        throw new Error('Project ID and Sprint ID are required');
      }

      // Update the node data
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === useCaseData.useCaseId) {
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

      const diagramId = `${projectId}-${sprintId}`;

      // First, try to get the existing component
      console.log("useCaseData", useCaseData);
  let component = await DiagramComponentService.getComponent(useCaseData.nodeId, diagramId);

      if (!component) {
        // If component doesn't exist, create it
        component = await DiagramComponentService.getOrCreateComponent(
          useCaseData.useCaseId,
          diagramId,
          {
            name: useCaseData.name,
            description: useCaseData.description || null,
            version: useCaseData.version || null,
            deletable: true,
            preconditions: specifications?.preconditions.filter(p => p.trim() !== '') || [],
            postconditions: specifications?.postconditions.filter(p => p.trim() !== '') || [],
            created_by: 'system',
            last_updated_by: 'system'
          }
        );
      } else {
        // Update existing component
        component = await DiagramComponentService.updateComponent(component.id, {
          name: useCaseData.name,
          description: useCaseData.description || null,
          version: useCaseData.version || null,
          deletable: true,
          preconditions: specifications?.preconditions.filter(p => p.trim() !== '') || [],
          postconditions: specifications?.postconditions.filter(p => p.trim() !== '') || [],
          last_updated_by: 'system'
        });
      }

      // Save the specifications (flows)
      if (specifications?.flows) {
        // First, find the normal flow if it exists
        const normalFlow = specifications.flows.find(flow => flow.type === 'NORMAL');
        if (normalFlow) {
          try {
            // Get existing specifications for this use case
            const existingSpecs = await DiagramUseCaseSpecificationService.getSpecificationsByUseCaseId(component.id);
            const existingNormalFlow = existingSpecs.find((spec: { type: string }) => spec.type === 'NORMAL');

            if (existingNormalFlow) {
              // Update existing normal flow
              await DiagramUseCaseSpecificationService.updateSpecification(existingNormalFlow.id, {
                type: normalFlow.type,
                name: normalFlow.name,
                entry_point: normalFlow.entry_point,
                exit_point: normalFlow.exit_point,
                steps: normalFlow.steps
              });
            } else {
              // Create new normal flow
              await DiagramUseCaseSpecificationService.createSpecification({
                usecase_id: component.id,
                type: normalFlow.type,
                name: normalFlow.name,
                entry_point: normalFlow.entry_point,
                exit_point: normalFlow.exit_point,
                steps: normalFlow.steps
              });
            }
          } catch (error) {
            console.error('Error saving normal flow:', error);
            throw new Error('Failed to save normal flow');
          }
        }

        // Handle other flows (alternative and exception)
        for (const flow of specifications.flows) {
          if (flow.type !== 'NORMAL') {
            try {
              if (flow.id.startsWith('normal-') || flow.id.startsWith('alternative-') || flow.id.startsWith('exception-')) {
                // Create new specification for other flows
                await DiagramUseCaseSpecificationService.createSpecification({
                  usecase_id: component.id,
                  type: flow.type,
                  name: flow.name,
                  entry_point: flow.entry_point,
                  exit_point: flow.exit_point,
                  steps: flow.steps
                });
              } else {
                // Update existing specification
                await DiagramUseCaseSpecificationService.updateSpecification(flow.id, {
                  type: flow.type,
                  name: flow.name,
                  entry_point: flow.entry_point,
                  exit_point: flow.exit_point,
                  steps: flow.steps
                });
              }
            } catch (error) {
              console.error(`Error saving flow ${flow.id}:`, error);
              throw new Error(`Failed to save flow ${flow.name}`);
            }
          }
        }
      }

      // Save the diagram data
      await saveDiagramData(projectId, sprintId, getNodes(), getEdges());
      toast.success('Changes saved successfully');
      closeModal();
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