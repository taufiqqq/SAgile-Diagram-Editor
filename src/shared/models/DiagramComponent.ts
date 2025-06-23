import { v4 as uuidv4 } from "uuid";
import pool from "../../backend/config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Client-side interface for diagram components
export interface DiagramComponent {
  id: string;
  node_id: string;
  diagram_id: string;
  name: string;
  description: string | null;
  version: string | null;
  deletable: boolean;
  created_by: string;
  last_updated_by: string;
  preconditions: string[];
  postconditions: string[];
  created_at: Date;
  updated_at: Date;
}

// Server-side interface that extends RowDataPacket
export interface DiagramComponentRow extends RowDataPacket {
  id: string;
  node_id: string;
  diagram_id: string;
  name: string;
  description: string | null;
  version: string | null;
  deletable: boolean;
  created_by: string;
  last_updated_by: string;
  preconditions: string[];
  postconditions: string[];
  created_at: Date;
  updated_at: Date;
}

export class DiagramComponentModel {
  // Update create method to handle JSON parsing safely
  static async create(
    data: Omit<DiagramComponentRow, "id" | "created_at" | "updated_at">
  ): Promise<DiagramComponentRow> {
    try {
      const {
        node_id,
        diagram_id,
        name,
        description,
        version,
        deletable,
        created_by,
        last_updated_by,
        preconditions,
        postconditions,
      } = data;
      const id = uuidv4();

      await pool.query<ResultSetHeader>(
        "INSERT INTO diagram_components (id, node_id, diagram_id, name, description, version, deletable, created_by, last_updated_by, preconditions, postconditions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          node_id,
          diagram_id,
          name,
          description || null,
          version || null,
          deletable,
          created_by,
          last_updated_by,
          JSON.stringify(preconditions || []),
          JSON.stringify(postconditions || []),
        ]
      );

      // Use findById which now has safe JSON parsing
      const component = await this.findById(id);
      
      if (!component) {
        throw new Error("Failed to create diagram component");
      }

      return component;
    } catch (error) {
      console.error("Error in create diagram component:", error);
      throw new Error(
        `Failed to create diagram component: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Update findById method to use safe JSON parsing
  static async findById(id: string): Promise<DiagramComponentRow | null> {
    const [rows] = await pool.query<DiagramComponentRow[]>(
      "SELECT * FROM diagram_components WHERE id = ?",
      [id]
    );

    if (!rows[0]) return null;

    // Reuse the same safe parsing function
    const safeParseJson = (field: any, defaultValue: any = null) => {
      if (field === null || field === undefined) return defaultValue;
      if (typeof field !== "string") return field; // Already parsed or not a string
      if (field.trim() === "") return defaultValue;

      try {
        return JSON.parse(field);
      } catch (e) {
        console.warn(`Failed to parse JSON for field:`, field);
        return defaultValue;
      }
    };

    // Parse JSON arrays back to string arrays
    const component = rows[0];
    component.preconditions = safeParseJson(component.preconditions as unknown as string, []);
    component.postconditions = safeParseJson(component.postconditions as unknown as string, []);

    return component;
  }

  static async findByNodeAndDiagram(
    nodeId: string,
    diagramId: string
  ): Promise<DiagramComponentRow | null> {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM diagram_components WHERE node_id = ? AND diagram_id = ?",
        [nodeId, diagramId]
      );

      if (!rows || (rows as any[]).length === 0) {
        return null;
      }

      const row = (rows as any[])[0];

      // Safe JSON parsing for all fields that might contain JSON
      const safeParseJson = (field: any, defaultValue: any = null) => {
        if (field === null || field === undefined) return defaultValue;
        if (typeof field !== "string") return field; // Already parsed or not a string
        if (field.trim() === "") return defaultValue;

        try {
          return JSON.parse(field);
        } catch (e) {
          console.warn(`Failed to parse JSON for field:`, field);
          return defaultValue;
        }
      };

      // Apply safe parsing to all JSON fields
      if (row.specifications) {
        row.specifications = safeParseJson(row.specifications, {});
      }

      if (row.preconditions) {
        row.preconditions = safeParseJson(row.preconditions, []);
      }

      if (row.postconditions) {
        row.postconditions = safeParseJson(row.postconditions, []);
      }

      // Add any other JSON fields that need parsing

      return row;
    } catch (error) {
      console.error("Error in findByNodeAndDiagram:", error);
      throw new Error(
        `Failed to get diagram component: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async update(
    id: string,
    data: Partial<Omit<DiagramComponentRow, "id" | "created_at" | "updated_at">>
  ): Promise<DiagramComponentRow | null> {
    const {
      name,
      description,
      version,
      deletable,
      last_updated_by,
      preconditions,
      postconditions,
    } = data;
    console.log("DiagramComponentModel.update - Input data:", {
      id,
      name,
      description,
      version,
      deletable,
      last_updated_by,
      preconditions,
      postconditions,
    });

    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (version !== undefined) {
      updates.push("version = ?");
      values.push(version);
    }
    if (deletable !== undefined) {
      updates.push("deletable = ?");
      values.push(deletable);
    }
    if (last_updated_by !== undefined) {
      updates.push("last_updated_by = ?");
      values.push(last_updated_by);
    }
    if (preconditions !== undefined) {
      updates.push("preconditions = ?");
      values.push(JSON.stringify(preconditions));
    }
    if (postconditions !== undefined) {
      updates.push("postconditions = ?");
      values.push(JSON.stringify(postconditions));
    }

    console.log("DiagramComponentModel.update - SQL updates:", updates);
    console.log("DiagramComponentModel.update - SQL values:", values);

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE diagram_components SET ${updates.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    console.log("DiagramComponentModel.update - SQL query:", query);
    console.log("DiagramComponentModel.update - SQL values:", values);

    const [result] = await pool.query<ResultSetHeader>(query, values);
    console.log("DiagramComponentModel.update - Update result:", result);

    const updatedComponent = await this.findById(id);
    console.log(
      "DiagramComponentModel.update - Updated component:",
      updatedComponent
    );
    return updatedComponent;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM diagram_components WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
