import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface DiagramComponentRow extends RowDataPacket {
  id: string;
  node_id: string;
  diagram_id: string;
  name: string;
  description: string | null;
  version: string | null;
  deletable: boolean;
  created_at: Date;
  updated_at: Date;
}

export class DiagramComponentModel {
  static async create(data: Omit<DiagramComponentRow, 'id' | 'created_at' | 'updated_at'>): Promise<DiagramComponentRow> {
    const { node_id, diagram_id, name, description, version, deletable } = data;
    const id = uuidv4();
    
    await pool.query<ResultSetHeader>(
      'INSERT INTO diagram_components (id, node_id, diagram_id, name, description, version, deletable) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, node_id, diagram_id, name, description || null, version || null, deletable]
    );
    
    const [rows] = await pool.query<DiagramComponentRow[]>(
      'SELECT * FROM diagram_components WHERE id = ?',
      [id]
    );
    
    if (!rows[0]) {
      throw new Error('Failed to create diagram component');
    }
    
    return rows[0];
  }

  static async findById(id: string): Promise<DiagramComponentRow | null> {
    const [rows] = await pool.query<DiagramComponentRow[]>(
      'SELECT * FROM diagram_components WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByNodeAndDiagram(nodeId: string, diagramId: string): Promise<DiagramComponentRow | null> {
    const [rows] = await pool.query<DiagramComponentRow[]>(
      'SELECT * FROM diagram_components WHERE node_id = ? AND diagram_id = ?',
      [nodeId, diagramId]
    );
    return rows[0] || null;
  }

  static async update(id: string, data: Partial<DiagramComponentRow>): Promise<DiagramComponentRow | null> {
    const { name, description, version, deletable } = data;
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (version !== undefined) {
      updates.push('version = ?');
      values.push(version);
    }
    if (deletable !== undefined) {
      updates.push('deletable = ?');
      values.push(deletable);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE diagram_components SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM diagram_components WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
} 