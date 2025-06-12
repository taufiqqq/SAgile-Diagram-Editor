import { Diagram, DiagramModel } from '../../shared/models/Diagram';
import { RowDataPacket } from 'mysql2';

export class DiagramService {
  /**
   * Get or create a diagram for a project
   * @param projectId The project ID
   * @param sprintId The sprint ID (ignored)
   * @param plantuml The PlantUML string
   * @param diagramData The diagram data
   * @returns The diagram
   */
  static async getOrCreateDiagram(
    projectId: string,
    sprintId: string, // Kept for backward compatibility
    plantuml: string,
    diagramData: any,
    isCreating: boolean = true
  ): Promise<Diagram> {
    // Check if diagram exists - only using projectId
    let diagram = await DiagramModel.findByProject(projectId);
    
    if (diagram) {
      if(isCreating){
        return diagram;
      }
      // Update existing diagram
      await DiagramModel.update(diagram.id, {
        diagram_element: diagramData,
      } as Partial<Diagram>);
      
      // Get updated diagram
      diagram = await DiagramModel.findByProject(projectId);
      if (!diagram) {
        throw new Error('Failed to retrieve updated diagram');
      }
      
      return diagram;
    } else {
      // Create new diagram
      return await DiagramModel.create({
        name: 'diagram1', // Hardcoded name as requested
        project_id: projectId,
        sprint_id: null, // Set sprint_id to null since it's no longer needed
        diagram_element: diagramData,
        original_plantuml: plantuml
      });
    }
  }
  
  /**
   * Get a diagram by project ID
   * @param projectId The project ID
   * @param sprintId The sprint ID (ignored)
   * @returns The diagram or null if not found
   */
  static async getDiagram(projectId: string, sprintId: string): Promise<Diagram | null> {
    return await DiagramModel.findByProject(projectId);
  }
} 