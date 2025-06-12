import { Diagram, DiagramModel } from "../../shared/models/Diagram";
import { RowDataPacket } from "mysql2";

export class DiagramService {
  /**
   * Get or create a diagram for a project
   * @param projectId The project ID
   * @param plantuml The PlantUML string
   * @param diagramData The diagram data
   * @returns The diagram
   */
  static async getOrCreateDiagram(
    systemName: string,
    projectId: string,
    plantuml: string,
    diagramData: any,
    isCreating: boolean = true
  ): Promise<Diagram> {
    // Check if diagram exists - only using projectId
    let diagram = await DiagramModel.findByProject(projectId);
    console.log("Found existing diagram:", diagram ? "Yes" : "No");
    console.log("isCreating:", isCreating);

    if (isCreating) {
      //force create
      console.log("DOING: FORCE CREATING");
      if (diagram) {
        await DiagramModel.delete(diagram.id);
      }
      return await DiagramModel.create({
        name: systemName,
        project_id: projectId,
        diagram_element: diagramData,
        original_plantuml: plantuml,
      });
    }
    if (!diagram) {
      console.log("DOING: THROWING ERROR");
      throw new Error("No diagram found and not creating");
    }
    if (diagramData) {
      console.log("Diagram data:", JSON.stringify(diagramData, null, 2));
      console.log("DOING: UPDATE");
      await DiagramModel.update(diagram.id, {
        diagram_element: diagramData,
      } as Partial<Diagram>);

      // Get updated diagram
      diagram = await DiagramModel.findByProject(projectId);

      if (!diagram) {
        throw new Error("No diagram found and not creating");
      }
      return diagram;
    }

    console.log("DOING: RETURNING EXISTING");
    //return existing
    return diagram;
  }

  /**
   * Get a diagram by project ID
   * @param projectId The project ID
   * @returns The diagram or null if not found
   */
  static async getDiagram(projectId: string): Promise<Diagram | null> {
    return await DiagramModel.findByProject(projectId);
  }
}
