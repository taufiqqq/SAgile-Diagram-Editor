import { Request, Response } from 'express';
import { DiagramService } from '../services/DiagramService';
import { Diagram } from '../models/Diagram';
import pool from '../server/config/database';

export class DiagramController {
  /**
   * Process PlantUML and save diagram data
   */
  static async processPlantUML(req: Request, res: Response): Promise<void> {
    try {
      const { project_id, sprint_id, plantuml } = req.body;
      
      // Validate required fields
      if (!project_id || !sprint_id || !plantuml) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: project_id, sprint_id, or plantuml'
        });
        return;
      }
      
      // Process PlantUML to get diagram data
      const diagramData = await processPlantUMLToDiagramData(plantuml);
      
      // Save or update diagram in database
      const diagram = await DiagramService.getOrCreateDiagram(
        project_id,
        sprint_id,
        plantuml,
        diagramData
      );
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Diagram processed and saved successfully',
        data: {
          id: diagram.id,
          name: diagram.name
        }
      });
    } catch (error) {
      console.error('Error processing PlantUML:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing PlantUML',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  /**
   * Get diagram data by project and sprint ID
   */
  static async getDiagram(req: Request, res: Response): Promise<void> {
    try {
      // Handle both parameter naming conventions and types
      const projectId = req.params.projectId || req.params.project_id;
      const sprintId = req.params.sprintId || req.params.sprint_id;
      
      // Validate required fields
      if (!projectId || !sprintId) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: projectId/project_id or sprintId/sprint_id'
        });
        return;
      }
      
      // Get diagram from database
      const diagram = await DiagramService.getDiagram(projectId.toString(), sprintId.toString());
      
      if (!diagram) {
        res.status(404).json({
          success: false,
          message: 'Diagram not found'
        });
        return;
      }
      
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
      const { project_id, sprint_id, nodes, edges } = req.body;
      
      // Validate required fields
      if (!project_id || !sprint_id || !nodes || !edges) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: project_id, sprint_id, nodes, or edges'
        });
        return;
      }

      // Create or update diagram
      const diagram = await DiagramService.getOrCreateDiagram(
        project_id,
        sprint_id,
        '', // Empty PlantUML for now
        { nodes, edges }
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

// This function would be replaced with your actual PlantUML processing logic
async function processPlantUMLToDiagramData(plantuml: string): Promise<any> {
  try {
    // For now, we'll create a simple implementation that extracts actors and use cases
    // from the PlantUML string and creates nodes and edges
    
    // Extract actors (lines containing "actor")
    const actorLines = plantuml.match(/actor\s+"([^"]+)"/g) || [];
    const actors = actorLines.map(line => {
      const match = line.match(/actor\s+"([^"]+)"/);
      return match ? match[1] : '';
    }).filter(Boolean);
    
    // Extract use cases (lines containing "usecase")
    const useCaseLines = plantuml.match(/usecase\s+"([^"]+)"/g) || [];
    const useCases = useCaseLines.map(line => {
      const match = line.match(/usecase\s+"([^"]+)"/);
      return match ? match[1] : '';
    }).filter(Boolean);
    
    // Extract relationships (lines containing "-->")
    const relationshipLines = plantuml.match(/"([^"]+)"\s*-->\s*"([^"]+)"/g) || [];
    const relationships = relationshipLines.map(line => {
      const match = line.match(/"([^"]+)"\s*-->\s*"([^"]+)"/);
      return match ? { source: match[1], target: match[2] } : null;
    }).filter((rel): rel is { source: string; target: string } => rel !== null);
    
    // Create nodes
    const nodes = [
      ...actors.map((actor, index) => ({
        id: `actor-${index}`,
        type: 'actor',
        position: { x: 100, y: 100 + index * 100 },
        data: { 
          type: 'actor',
          label: actor 
        }
      })),
      ...useCases.map((useCase, index) => ({
        id: `usecase-${index}`,
        type: 'usecase',
        position: { x: 300, y: 100 + index * 100 },
        data: { 
          type: 'usecase',
          label: useCase 
        }
      }))
    ];
    
    // Create edges
    const edges = relationships.map((rel, index) => {
      const sourceNode = nodes.find(node => node.data.label === rel.source);
      const targetNode = nodes.find(node => node.data.label === rel.target);
      
      if (sourceNode && targetNode) {
        return {
          id: `edge-${index}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'smoothstep'
        };
      }
      return null;
    }).filter(Boolean);
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error processing PlantUML:', error);
    // Return empty diagram data in case of error
    return { nodes: [], edges: [] };
  }
} 