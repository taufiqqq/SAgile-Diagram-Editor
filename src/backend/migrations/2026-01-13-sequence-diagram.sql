-- Migration: Add Sequence Diagram Support
-- Date: 2026-01-13
-- Description: Extends the existing diagram system to support sequence diagrams

-- Add diagram_type column to existing diagrams table
-- ALTER TABLE diagrams
-- ADD COLUMN diagram_type ENUM('usecase', 'sequence') DEFAULT 'usecase' AFTER name;
