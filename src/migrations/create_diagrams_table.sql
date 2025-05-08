CREATE TABLE IF NOT EXISTS diagrams (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  sprint_id VARCHAR(36) NOT NULL,
  diagram_element JSON NOT NULL,
  original_plantuml TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project_sprint (project_id, sprint_id)
); 