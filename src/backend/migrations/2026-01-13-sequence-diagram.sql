-- Migration: Add Sequence Diagram Support
-- Date: 2026-01-13
-- Description: Extends the existing diagram system to support sequence diagrams

-- Step 1: Add diagram_type column to existing diagrams table (skip - already exists)
-- ALTER TABLE diagrams
-- ADD COLUMN diagram_type ENUM('usecase', 'sequence') DEFAULT 'usecase' AFTER name;

-- Step 2: Create sequence_diagram_elements table
DROP TABLE IF EXISTS sequence_diagram_messages;
DROP TABLE IF EXISTS sequence_diagram_elements;

CREATE TABLE IF NOT EXISTS sequence_diagram_elements (
  id VARCHAR(36) PRIMARY KEY,
  diagram_id VARCHAR(36) NOT NULL,
  element_type ENUM('actor', 'boundary', 'control', 'entity') NOT NULL,
  name VARCHAR(255) NOT NULL,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  width FLOAT DEFAULT 100,
  height FLOAT DEFAULT 100,
  stereotype VARCHAR(50),
  has_lifeline BOOLEAN DEFAULT TRUE,
  properties JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_diagram_id (diagram_id),
  INDEX idx_element_type (element_type),
  CONSTRAINT fk_seq_elem_diagram FOREIGN KEY (diagram_id) REFERENCES diagrams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Create sequence_diagram_messages table (edges/connections)
CREATE TABLE IF NOT EXISTS sequence_diagram_messages (
  id VARCHAR(36) PRIMARY KEY,
  diagram_id VARCHAR(36) NOT NULL,
  source_element_id VARCHAR(36) NOT NULL,
  target_element_id VARCHAR(36) NOT NULL,
  message_type ENUM('synchronous', 'asynchronous', 'return', 'create', 'destroy') DEFAULT 'synchronous',
  message_text VARCHAR(500) NOT NULL,
  parameters VARCHAR(1000),
  sequence_number INT,
  properties JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_diagram_id (diagram_id),
  INDEX idx_source (source_element_id),
  INDEX idx_target (target_element_id),
  INDEX idx_sequence (diagram_id, sequence_number),
  CONSTRAINT fk_seq_msg_diagram FOREIGN KEY (diagram_id) REFERENCES diagrams(id) ON DELETE CASCADE,
  CONSTRAINT fk_seq_msg_source FOREIGN KEY (source_element_id) REFERENCES sequence_diagram_elements(id) ON DELETE CASCADE,
  CONSTRAINT fk_seq_msg_target FOREIGN KEY (target_element_id) REFERENCES sequence_diagram_elements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification queries (uncomment to test)
-- SELECT * FROM diagrams WHERE diagram_type = 'sequence';
-- SELECT * FROM sequence_diagram_elements;
-- SELECT * FROM sequence_diagram_messages;
