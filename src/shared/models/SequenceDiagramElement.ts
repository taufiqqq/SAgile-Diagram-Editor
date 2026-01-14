import { v4 as uuidv4 } from 'uuid';
import pool from '../../backend/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type SequenceElementType = 'actor' | 'boundary' | 'control' | 'entity';

export interface SequenceDiagramElement extends RowDataPacket {
  id: string;
  diagram_id: string;
  element_type: SequenceElementType;
  name: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  stereotype: string;
  has_lifeline: boolean;
  properties: any;
  created_at: Date;
  updated_at: Date;
}

export class SequenceDiagramElementModel {
  static async create(data: Omit<SequenceDiagramElement, 'id' | 'created_at' | 'updated_at'>): Promise<SequenceDiagramElement> {
    const {
      diagram_id,
      element_type,
      name,
      position_x = 0,
      position_y = 0,
      width = 100,
      height = 100,
      stereotype,
      has_lifeline = true,
      properties = {}
    } = data;

    const id = uuidv4();
    await pool.query<ResultSetHeader>(
      `INSERT INTO sequence_diagram_elements
       (id, diagram_id, element_type, name, position_x, position_y, width, height, stereotype, has_lifeline, properties)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, diagram_id, element_type, name, position_x, position_y, width, height, stereotype, has_lifeline, JSON.stringify(properties)]
    );

    const element = await this.findById(id);
    if (!element) {
      throw new Error('Failed to create sequence diagram element');
    }
    return element;
  }

  static async findById(id: string): Promise<SequenceDiagramElement | null> {
    const [rows] = await pool.query<SequenceDiagramElement[]>(
      'SELECT * FROM sequence_diagram_elements WHERE id = ?',
      [id]
    );

    if (!rows[0]) return null;

    // Parse JSON properties
    const element = rows[0];
    if (typeof element.properties === 'string') {
      element.properties = JSON.parse(element.properties);
    }

    return element;
  }

  static async findByDiagram(diagramId: string): Promise<SequenceDiagramElement[]> {
    const [rows] = await pool.query<SequenceDiagramElement[]>(
      'SELECT * FROM sequence_diagram_elements WHERE diagram_id = ? ORDER BY position_x ASC',
      [diagramId]
    );

    // Parse JSON properties for all elements
    return rows.map(element => {
      if (typeof element.properties === 'string') {
        element.properties = JSON.parse(element.properties);
      }
      return element;
    });
  }

  static async update(id: string, data: Partial<SequenceDiagramElement>): Promise<SequenceDiagramElement | null> {
    const {
      name,
      position_x,
      position_y,
      width,
      height,
      stereotype,
      has_lifeline,
      properties
    } = data;

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (position_x !== undefined) {
      updates.push('position_x = ?');
      values.push(position_x);
    }
    if (position_y !== undefined) {
      updates.push('position_y = ?');
      values.push(position_y);
    }
    if (width !== undefined) {
      updates.push('width = ?');
      values.push(width);
    }
    if (height !== undefined) {
      updates.push('height = ?');
      values.push(height);
    }
    if (stereotype !== undefined) {
      updates.push('stereotype = ?');
      values.push(stereotype);
    }
    if (has_lifeline !== undefined) {
      updates.push('has_lifeline = ?');
      values.push(has_lifeline);
    }
    if (properties !== undefined) {
      updates.push('properties = ?');
      values.push(JSON.stringify(properties));
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE sequence_diagram_elements SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM sequence_diagram_elements WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async deleteByDiagram(diagramId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM sequence_diagram_elements WHERE diagram_id = ?',
      [diagramId]
    );
    return result.affectedRows > 0;
  }
}
