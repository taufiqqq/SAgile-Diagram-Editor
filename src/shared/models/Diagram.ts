import { v4 as uuidv4 } from 'uuid';
import pool from '../../backend/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Diagram extends RowDataPacket {
  id: string;
  project_id: string;
  diagram_element: any;
  original_plantuml: string;
  created_at: Date;
  updated_at: Date;
}

export class DiagramModel {
  static async create(data: Omit<Diagram, 'id' | 'created_at' | 'updated_at'>): Promise<Diagram> {
    const { project_id, diagram_element, original_plantuml } = data;
    const id = uuidv4();
    await pool.query<ResultSetHeader>(
      'INSERT INTO diagrams (id, project_id, diagram_element, original_plantuml) VALUES (?, ?, ?, ?)',
      [id, project_id, JSON.stringify(diagram_element), original_plantuml]
    );
    const diagram = await this.findById(id);
    if (!diagram) {
      throw new Error('Failed to create diagram');
    }
    return diagram;
  }

  static async findById(id: string): Promise<Diagram | null> {
    const [rows] = await pool.query<Diagram[]>('SELECT * FROM diagrams WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByProject(projectId: string): Promise<Diagram | null> {
    const [rows] = await pool.query<Diagram[]>(
      'SELECT * FROM diagrams WHERE project_id = ?',
      [projectId]
    );
    return rows[0] || null;
  }

  static async update(id: string, data: Partial<Diagram>): Promise<Diagram | null> {
    const { project_id, diagram_element, original_plantuml } = data;
    const updates = [];
    const values = [];

    if (project_id !== undefined) {
      updates.push('project_id = ?');
      values.push(project_id);
    }
    if (diagram_element !== undefined) {
      updates.push('diagram_element = ?');
      values.push(JSON.stringify(diagram_element));
    }
    if (original_plantuml !== undefined) {
      updates.push('original_plantuml = ?');
      values.push(original_plantuml);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE diagrams SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM diagrams WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
} 