import { Request, Response } from 'express';
import { DiagramService } from '../services/DiagramRepositoryService';
import { parsePlantUML } from "../../features/parsing/plantuml-use-case/GenerateNodes";

export class DiagramController {
  /**
   * Process PlantUML and save diagram data
   */
  static async processPlantUML(req: Request, res: Response): Promise<void> {
    try {
      console.log("Processing PlantUML:", req.body);

      const { project_id, plantuml, system_name, create_new } = req.body;
  
      // Validate required fields
      if (!project_id || !plantuml) {
        res.status(400).json({
          success: false,
          message: "Missing required fields: project_id or plantuml",
        });
        return;
      }
  
      // Parse the PlantUML string
      const { nodes, edges } = parsePlantUML(plantuml);
  
      console.log("create new is "+ create_new);

      // Save the diagram to the database
     const diagram = await DiagramService.getOrCreateDiagram(
        system_name,
        project_id,
        plantuml,
        create_new ?  { nodes, edges }: undefined,
        create_new
      ); 

      console.log("Diagram saved to database:", diagram);
  
      res.status(200).json({
        success: true,
        message: "Diagram processed and saved successfully",
        data: {
          id: diagram.id,
          name: diagram.name,
          nodes,
          edges,
        },
      });
    } catch (error) {
      console.error("Error processing PlantUML:", error);
      res.status(500).json({
        success: false,
        message: "Error processing PlantUML",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  
  /**
   * Get diagram data by project ID
   */
  static async getDiagram(req: Request, res: Response): Promise<void> {
    try {
      // Handle both parameter naming conventions and types
      const projectId = req.params.projectId || req.params.project_id;
      
      // Validate required fields
      if (!projectId) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameter: projectId/project_id'
        });
        return;
      }
      
      // Get diagram from database
      const diagram = await DiagramService.getDiagram(projectId.toString());
      
      if (!diagram) {
        res.status(404).json({
          success: false,
          message: 'Diagram not found'
        });
        return;
      }

      console.log('Fetched diagram from database:', diagram);
      
      // Parse diagram_element if it's a string
      let diagramData = diagram.diagram_element;
      if (typeof diagramData === 'string') {
        try {
          diagramData = JSON.parse(diagramData);
        } catch (e) {
          console.error('Error parsing diagram data:', e);
          diagramData = { nodes: [], edges: [] };
        }
      }
      console.log('Parsed diagram data:', diagramData);
      // Return diagram data in the expected format
      res.status(200).json({
        success: true,
        data: {
          id: diagram.id,
          name: diagram.name,
          nodes: diagramData.nodes || [],
          edges: diagramData.edges || [],
          original_plantuml: diagram.original_plantuml
        }
      });
    } catch (error) {
      console.error('Error getting diagram:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting diagram',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Save diagram data
   */
  static async saveDiagram(req: Request, res: Response): Promise<void> {
    try {
      const { project_id, nodes, edges, isCreating} = req.body;
      
      // Validate required fields
      if (!project_id || !nodes || !edges) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: project_id, nodes, or edges'
        });
        return;
      }

      // Create or update diagram
      const diagram = await DiagramService.getOrCreateDiagram(
        '',
        project_id,
        '', // Empty PlantUML for now
        { nodes, edges },
        isCreating
      );

      res.status(200).json({
        success: true,
        message: 'Diagram saved successfully',
        data: {
          id: diagram.id,
          name: diagram.name
        }
      });
    } catch (error) {
      console.error('Error saving diagram:', error);
      res.status(500).json({
        success: false,
        message: 'Error saving diagram',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 