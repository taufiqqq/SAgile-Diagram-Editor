import { v4 as uuidv4 } from 'uuid';
import pool from '../../backend/config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type SequenceMessageType = 'synchronous' | 'asynchronous' | 'return' | 'create' | 'destroy';

export interface SequenceDiagramMessage extends RowDataPacket {
  id: string;
  diagram_id: string;
  source_element_id: string;
  target_element_id: string;
  message_type: SequenceMessageType;
  message_text: string;
  parameters: string;
  sequence_number: number;
  properties: any;
  created_at: Date;
  updated_at: Date;
}

export class SequenceDiagramMessageModel {
  static async create(data: Omit<SequenceDiagramMessage, 'id' | 'created_at' | 'updated_at'>): Promise<SequenceDiagramMessage> {
    const {
      diagram_id,
      source_element_id,
      target_element_id,
      message_type = 'synchronous',
      message_text,
      parameters = '',
      sequence_number = 0,
      properties = {}
    } = data;

    const id = uuidv4();
    await pool.query<ResultSetHeader>(
      `INSERT INTO sequence_diagram_messages
       (id, diagram_id, source_element_id, target_element_id, message_type, message_text, parameters, sequence_number, properties)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, diagram_id, source_element_id, target_element_id, message_type, message_text, parameters, sequence_number, JSON.stringify(properties)]
    );

    const message = await this.findById(id);
    if (!message) {
      throw new Error('Failed to create sequence diagram message');
    }
    return message;
  }

  static async findById(id: string): Promise<SequenceDiagramMessage | null> {
    const [rows] = await pool.query<SequenceDiagramMessage[]>(
      'SELECT * FROM sequence_diagram_messages WHERE id = ?',
      [id]
    );

    if (!rows[0]) return null;

    // Parse JSON properties
    const message = rows[0];
    if (typeof message.properties === 'string') {
      message.properties = JSON.parse(message.properties);
    }

    return message;
  }

  static async findByDiagram(diagramId: string): Promise<SequenceDiagramMessage[]> {
    const [rows] = await pool.query<SequenceDiagramMessage[]>(
      'SELECT * FROM sequence_diagram_messages WHERE diagram_id = ? ORDER BY sequence_number ASC',
      [diagramId]
    );

    // Parse JSON properties for all messages
    return rows.map(message => {
      if (typeof message.properties === 'string') {
        message.properties = JSON.parse(message.properties);
      }
      return message;
    });
  }

  static async update(id: string, data: Partial<SequenceDiagramMessage>): Promise<SequenceDiagramMessage | null> {
    const {
      message_type,
      message_text,
      parameters,
      sequence_number,
      properties
    } = data;

    const updates: string[] = [];
    const values: any[] = [];

    if (message_type !== undefined) {
      updates.push('message_type = ?');
      values.push(message_type);
    }
    if (message_text !== undefined) {
      updates.push('message_text = ?');
      values.push(message_text);
    }
    if (parameters !== undefined) {
      updates.push('parameters = ?');
      values.push(parameters);
    }
    if (sequence_number !== undefined) {
      updates.push('sequence_number = ?');
      values.push(sequence_number);
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
      `UPDATE sequence_diagram_messages SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM sequence_diagram_messages WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async deleteByDiagram(diagramId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM sequence_diagram_messages WHERE diagram_id = ?',
      [diagramId]
    );
    return result.affectedRows > 0;
  }

  static async getNextSequenceNumber(diagramId: string): Promise<number> {
    const [rows] = await pool.query<any[]>(
      'SELECT MAX(sequence_number) as max_num FROM sequence_diagram_messages WHERE diagram_id = ?',
      [diagramId]
    );

    const maxNum = rows[0]?.max_num;
    return maxNum !== null && maxNum !== undefined ? maxNum + 1 : 1;
  }
}
