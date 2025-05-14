import { v4 as uuidv4 } from 'uuid';
import pool from '../server/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export enum FlowType {
  NORMAL = 'NORMAL',
  ALTERNATIVE = 'ALTERNATIVE',
  EXCEPTION = 'EXCEPTION'
}

// Base interface for flow steps
export interface FlowStep {
  id: string;
  step_number: number;
  description: string;
}

// Base flow interface
export interface SequenceFlow extends RowDataPacket {
  id: string;
  diagram_id: string;
  type: FlowType;
  name: string | null;
  description: string | null;
  entry_point: string | null; // ID of the step in normal flow where this flow starts (null for normal flow)
  exit_point: string | null;  // ID of the step in normal flow where this flow returns (null for normal flow)
  steps: FlowStep[];
  created_at: Date;
  updated_at: Date;
}

export class SequenceFlowModel {
  static async create(data: Omit<SequenceFlow, 'id' | 'created_at' | 'updated_at'>): Promise<SequenceFlow> {
    const { diagram_id, type, name, description, entry_point, exit_point, steps } = data;
    const id = uuidv4();
    
    // Create the sequence flow
    await pool.query<ResultSetHeader>(
      'INSERT INTO diagram_sequence_flows (id, diagram_id, type, name, description, entry_point, exit_point) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, diagram_id, type, name, description, entry_point, exit_point]
    );

    // Insert flow steps
    for (const step of steps) {
      await pool.query<ResultSetHeader>(
        'INSERT INTO flow_steps (id, flow_id, step_number, description) VALUES (?, ?, ?, ?)',
        [uuidv4(), id, step.step_number, step.description]
      );
    }

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create sequence flow');
    }
    
    return created;
  }

  static async findById(id: string): Promise<SequenceFlow | null> {
    const [rows] = await pool.query<SequenceFlow[]>(
      'SELECT * FROM diagram_sequence_flows WHERE id = ?',
      [id]
    );
    
    if (!rows[0]) return null;

    // Get the steps for this flow
    const [stepRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM flow_steps WHERE flow_id = ? ORDER BY step_number',
      [id]
    );

    return {
      ...rows[0],
      steps: stepRows as FlowStep[]
    };
  }

  static async findByDiagramId(diagramId: string): Promise<SequenceFlow[]> {
    const [rows] = await pool.query<SequenceFlow[]>(
      'SELECT * FROM diagram_sequence_flows WHERE diagram_id = ?',
      [diagramId]
    );

    // Get steps for all flows
    const flows = await Promise.all(rows.map(async (flow) => {
      const [stepRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM flow_steps WHERE flow_id = ? ORDER BY step_number',
        [flow.id]
      );
      return {
        ...flow,
        steps: stepRows as FlowStep[]
      };
    }));

    return flows;
  }

  static async update(id: string, data: Partial<Omit<SequenceFlow, 'id' | 'created_at' | 'updated_at'>>): Promise<SequenceFlow | null> {
    const { name, description, entry_point, exit_point, steps } = data;
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (entry_point !== undefined) {
      updates.push('entry_point = ?');
      values.push(entry_point);
    }
    if (exit_point !== undefined) {
      updates.push('exit_point = ?');
      values.push(exit_point);
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE diagram_sequence_flows SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
    }

    // Update steps if provided
    if (steps) {
      // Delete existing steps
      await pool.query<ResultSetHeader>(
        'DELETE FROM flow_steps WHERE flow_id = ?',
        [id]
      );

      // Insert new steps
      for (const step of steps) {
        await pool.query<ResultSetHeader>(
          'INSERT INTO flow_steps (id, flow_id, step_number, description) VALUES (?, ?, ?, ?)',
          [uuidv4(), id, step.step_number, step.description]
        );
      }
    }

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    // First delete all steps
    await pool.query<ResultSetHeader>(
      'DELETE FROM flow_steps WHERE flow_id = ?',
      [id]
    );

    // Then delete the flow
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM diagram_sequence_flows WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
