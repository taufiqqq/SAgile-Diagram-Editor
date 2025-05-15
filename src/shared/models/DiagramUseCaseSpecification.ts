import { v4 as uuidv4 } from 'uuid';
import pool from '../../backend/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type SpecificationType = 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';

export interface SpecificationStep {
  id: string;
  description: string;
}

export interface DiagramUseCaseSpecification {
  id: string;
  usecase_id: string;
  type: SpecificationType;
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: SpecificationStep[];
  created_at: Date;
  updated_at: Date;
}

export interface DiagramUseCaseSpecificationRow extends RowDataPacket {
  id: string;
  usecase_id: string;
  type: SpecificationType;
  name: string;
  entry_point: string | null;
  exit_point: string | null;
  steps: string; // JSON string
  created_at: Date;
  updated_at: Date;
}

export class DiagramUseCaseSpecificationModel {
  static async create(data: Omit<DiagramUseCaseSpecification, 'id' | 'created_at' | 'updated_at'>): Promise<DiagramUseCaseSpecification> {
    const id = uuidv4();
    
    await pool.query<ResultSetHeader>(
      'INSERT INTO diagram_usecase_specification (id, usecase_id, type, name, entry_point, exit_point, steps) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, data.usecase_id, data.type, data.name, data.entry_point || null, data.exit_point || null, JSON.stringify(data.steps)]
    );
    
    const [rows] = await pool.query<DiagramUseCaseSpecificationRow[]>(
      'SELECT * FROM diagram_usecase_specification WHERE id = ?',
      [id]
    );
    
    if (!rows[0]) {
      throw new Error('Failed to create specification');
    }

    return this.mapRowToSpecification(rows[0]);
  }

  static async findById(id: string): Promise<DiagramUseCaseSpecification | null> {
    const [rows] = await pool.query<DiagramUseCaseSpecificationRow[]>(
      'SELECT * FROM diagram_usecase_specification WHERE id = ?',
      [id]
    );
    
    if (!rows[0]) return null;
    return this.mapRowToSpecification(rows[0]);
  }

  static async findByUseCaseId(usecaseId: string): Promise<DiagramUseCaseSpecification[]> {
    const [rows] = await pool.query<DiagramUseCaseSpecificationRow[]>(
      'SELECT * FROM diagram_usecase_specification WHERE usecase_id = ?',
      [usecaseId]
    );
    
    return rows.map(row => this.mapRowToSpecification(row));
  }

  static async update(id: string, data: Partial<Omit<DiagramUseCaseSpecification, 'id' | 'created_at' | 'updated_at'>>): Promise<DiagramUseCaseSpecification | null> {
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.entry_point !== undefined) {
      updates.push('entry_point = ?');
      values.push(data.entry_point || null);
    }
    if (data.exit_point !== undefined) {
      updates.push('exit_point = ?');
      values.push(data.exit_point || null);
    }
    if (data.steps !== undefined) {
      updates.push('steps = ?');
      values.push(JSON.stringify(data.steps));
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE diagram_usecase_specification SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM diagram_usecase_specification WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  private static mapRowToSpecification(row: DiagramUseCaseSpecificationRow): DiagramUseCaseSpecification {
    return {
      ...row,
      steps: JSON.parse(row.steps),
      entry_point: row.entry_point || undefined,
      exit_point: row.exit_point || undefined
    };
  }
} 