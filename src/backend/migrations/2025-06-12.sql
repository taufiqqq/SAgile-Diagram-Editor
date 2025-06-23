CREATE TABLE IF NOT EXISTS diagrams (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  diagram_element JSON NOT NULL,
  original_plantuml TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project (project_id)
); 

CREATE TABLE IF NOT EXISTS diagram_components (
    id VARCHAR(36) PRIMARY KEY,
    node_id VARCHAR(255) NOT NULL,
    diagram_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    deletable BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    last_updated_by VARCHAR(255),
    preconditions JSON,
    postconditions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_node_diagram (node_id, diagram_id)
); 

CREATE TABLE IF NOT EXISTS diagram_usecase_specification(
    id VARCHAR(36) PRIMARY KEY,
    usecase_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'NORMAL',
    name VARCHAR(255) NOT NULL,
    entry_point VARCHAR(255),
    exit_point VARCHAR(255),
    steps VARCHAR(4000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usecase_id) REFERENCES diagram_components(id) ON DELETE CASCADE
); 