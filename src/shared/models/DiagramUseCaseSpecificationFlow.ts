import pool from '../../backend/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface FlowStep {
  id: string;
  description: string;
}

export interface DiagramUseCaseSpecificationFlow {
  id: string;
  usecase_id: string;
  type: 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: FlowStep[];
  created_at: Date;
  updated_at: Date;
}

interface DbFlow extends RowDataPacket {
  id: string;
  usecase_id: string;
  type: 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';
  name: string;
  entry_point: string | null;
  exit_point: string | null;
  steps: string;
  created_at: Date;
  updated_at: Date;
}

export class DiagramUseCaseSpecificationFlowModel {
  private static convertDbFlowToFlow(dbFlow: DbFlow): DiagramUseCaseSpecificationFlow {
    return {
      ...dbFlow,
      entry_point: dbFlow.entry_point || undefined,
      exit_point: dbFlow.exit_point || undefined,
      steps: JSON.parse(dbFlow.steps)
    };
  }

  static async create(data: Omit<DiagramUseCaseSpecificationFlow, 'id' | 'created_at' | 'updated_at'>): Promise<DiagramUseCaseSpecificationFlow> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO diagram_usecase_specification_flow 
       (usecase_id, type, name, entry_point, exit_point, steps) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.usecase_id,
        data.type,
        data.name,
        data.entry_point,
        data.exit_point,
        JSON.stringify(data.steps)
      ]
    );

    const id = result.insertId.toString();
    const flow = await this.findById(id);
    if (!flow) {
      throw new Error('Failed to create specification');
    }
    return flow;
  }

  static async findById(id: string): Promise<DiagramUseCaseSpecificationFlow | null> {
    const [rows] = await pool.execute<DbFlow[]>(
      `SELECT * FROM diagram_usecase_specification_flow WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.convertDbFlowToFlow(rows[0]);
  }

  static async findByUseCaseId(usecaseId: string): Promise<DiagramUseCaseSpecificationFlow[]> {
    const [rows] = await pool.execute<DbFlow[]>(
      `SELECT * FROM diagram_usecase_specification_flow WHERE usecase_id = ?`,
      [usecaseId]
    );

    return rows.map(flow => this.convertDbFlowToFlow(flow));
  }

  static async update(id: string, data: Partial<Omit<DiagramUseCaseSpecificationFlow, 'id' | 'created_at' | 'updated_at'>>): Promise<DiagramUseCaseSpecificationFlow | null> {
    const updates: string[] = [];
    const values: any[] = [];

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
      values.push(data.entry_point);
    }
    if (data.exit_point !== undefined) {
      updates.push('exit_point = ?');
      values.push(data.exit_point);
    }
    if (data.steps !== undefined) {
      updates.push('steps = ?');
      values.push(JSON.stringify(data.steps));
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute<ResultSetHeader>(
      `UPDATE diagram_usecase_specification_flow 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `DELETE FROM diagram_usecase_specification_flow WHERE id = ?`,
      [id]
    );
  }
} 