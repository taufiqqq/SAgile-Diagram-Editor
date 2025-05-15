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