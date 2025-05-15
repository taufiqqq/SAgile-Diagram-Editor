import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DiagramComponentService } from '../../../backend/services/DiagramComponentRepositoryService';
import { DiagramUseCaseSpecificationService } from '../../../backend/services/DiagramUseCaseSpecificationService';
import { ShapeNode } from '../../diagram-editing/types';

interface UseCaseModalProps {
  isOpen: boolean;
  nodeData: ShapeNode;
  projectId: string;
  sprintId: string;
}

interface UseCaseData {
  id: string;
  name: string;
  description: string;
  version: string;
}

interface Specification {
  id: string;
  type: 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: Array<{
    id: string;
    description: string;
  }>;
}

interface Specifications {
  preconditions: string[];
  postconditions: string[];
  flows: Specification[];
}

const UseCaseModal: React.FC<UseCaseModalProps> = ({ isOpen, nodeData, projectId, sprintId }) => {
  const [useCaseData, setUseCaseData] = useState<UseCaseData>({
    id: '',
    name: '',
    description: '',
    version: ''
  });
  const [specifications, setSpecifications] = useState<Specifications>({
    preconditions: [],
    postconditions: [],
    flows: []
  });

  useEffect(() => {
    if (isOpen && nodeData) {
      const fetchData = async () => {
        try {
          // Get the component data
          let component = await DiagramComponentService.getComponent(
            nodeData.id,
            `${projectId}-${sprintId}`
          );

          if (!component) {
            // If component doesn't exist, create it
            component = await DiagramComponentService.getOrCreateComponent(
              nodeData.id,
              `${projectId}-${sprintId}`,
              {
                name: nodeData.data.label,
                description: null,
                version: null,
                deletable: true,
                preconditions: [],
                postconditions: [],
                created_by: 'system',
                last_updated_by: 'system'
              }
            );
          }

          // Update useCaseData with component details
          setUseCaseData({
            id: component.id,
            name: component.name,
            description: component.description || '',
            version: component.version || ''
          });

          // Get specifications
          const specs = await DiagramUseCaseSpecificationService.getSpecificationsByUseCaseId(component.id);
          
          // Initialize specifications with preconditions and postconditions from component
          setSpecifications({
            preconditions: component.preconditions || [],
            postconditions: component.postconditions || [],
            flows: specs.map((spec: any) => ({
              id: spec.id,
              type: spec.type,
              name: spec.name,
              entry_point: spec.entry_point,
              exit_point: spec.exit_point,
              steps: spec.steps
            }))
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load use case data');
        }
      };

      fetchData();
    }
  }, [isOpen, nodeData, projectId, sprintId]);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default UseCaseModal; 