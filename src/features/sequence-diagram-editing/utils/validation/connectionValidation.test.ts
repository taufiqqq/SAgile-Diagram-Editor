import { describe, it, expect } from 'vitest';
import {
  isValidConnectionType,
  getConnectionValidationError,
  getValidTargetTypes,
  getElementTypeLabel,
} from './connectionValidation';

describe('Sequence Diagram Connection Validation', () => {
  describe('Actor connections', () => {
    it('should allow Actor -> Boundary', () => {
      expect(isValidConnectionType('actor', 'boundary')).toBe(true);
    });

    it('should allow Actor -> Control', () => {
      expect(isValidConnectionType('actor', 'control')).toBe(true);
    });

    it('should not allow Actor -> Entity', () => {
      expect(isValidConnectionType('actor', 'entity')).toBe(false);
    });

    it('should not allow Actor -> Actor', () => {
      expect(isValidConnectionType('actor', 'actor')).toBe(false);
    });
  });

  describe('Boundary connections', () => {
    it('should allow Boundary -> Actor', () => {
      expect(isValidConnectionType('boundary', 'actor')).toBe(true);
    });

    it('should allow Boundary -> Control', () => {
      expect(isValidConnectionType('boundary', 'control')).toBe(true);
    });

    it('should not allow Boundary -> Entity', () => {
      expect(isValidConnectionType('boundary', 'entity')).toBe(false);
    });

    it('should not allow Boundary -> Boundary', () => {
      expect(isValidConnectionType('boundary', 'boundary')).toBe(false);
    });
  });

  describe('Control connections', () => {
    it('should allow Control -> Boundary', () => {
      expect(isValidConnectionType('control', 'boundary')).toBe(true);
    });

    it('should allow Control -> Entity', () => {
      expect(isValidConnectionType('control', 'entity')).toBe(true);
    });

    it('should not allow Control -> Actor', () => {
      expect(isValidConnectionType('control', 'actor')).toBe(false);
    });

    it('should not allow Control -> Control', () => {
      expect(isValidConnectionType('control', 'control')).toBe(false);
    });
  });

  describe('Entity connections', () => {
    it('should allow Entity -> Control', () => {
      expect(isValidConnectionType('entity', 'control')).toBe(true);
    });

    it('should not allow Entity -> Actor', () => {
      expect(isValidConnectionType('entity', 'actor')).toBe(false);
    });

    it('should not allow Entity -> Boundary', () => {
      expect(isValidConnectionType('entity', 'boundary')).toBe(false);
    });

    it('should not allow Entity -> Entity', () => {
      expect(isValidConnectionType('entity', 'entity')).toBe(false);
    });
  });

  describe('getValidTargetTypes', () => {
    it('should return correct targets for Actor', () => {
      const targets = getValidTargetTypes('actor');
      expect(targets).toEqual(['boundary', 'control']);
    });

    it('should return correct targets for Boundary', () => {
      const targets = getValidTargetTypes('boundary');
      expect(targets).toEqual(['actor', 'control']);
    });

    it('should return correct targets for Control', () => {
      const targets = getValidTargetTypes('control');
      expect(targets).toEqual(['boundary', 'entity']);
    });

    it('should return correct targets for Entity', () => {
      const targets = getValidTargetTypes('entity');
      expect(targets).toEqual(['control']);
    });
  });

  describe('getConnectionValidationError', () => {
    it('should return empty string for valid connections', () => {
      expect(getConnectionValidationError('actor', 'boundary')).toBe('');
      expect(getConnectionValidationError('control', 'entity')).toBe('');
    });

    it('should return error message for invalid connections', () => {
      const error = getConnectionValidationError('actor', 'entity');
      expect(error).toContain('Actor');
      expect(error).toContain('Entity');
      expect(error).toContain('cannot send messages');
    });
  });

  describe('getElementTypeLabel', () => {
    it('should return correct labels', () => {
      expect(getElementTypeLabel('actor')).toBe('Actor');
      expect(getElementTypeLabel('boundary')).toContain('Boundary');
      expect(getElementTypeLabel('boundary')).toContain('View');
      expect(getElementTypeLabel('control')).toContain('Control');
      expect(getElementTypeLabel('control')).toContain('Controller');
      expect(getElementTypeLabel('entity')).toContain('Entity');
      expect(getElementTypeLabel('entity')).toContain('Model');
    });
  });

  describe('MVC Architecture Rules', () => {
    it('should enforce three-tiered architecture', () => {
      // Presentation layer (Boundary) should communicate with Business layer (Control) and Actor
      expect(isValidConnectionType('boundary', 'control')).toBe(true);
      expect(isValidConnectionType('boundary', 'actor')).toBe(true);
      expect(isValidConnectionType('boundary', 'entity')).toBe(false); // Skip data layer

      // Business layer (Control) should communicate with Presentation (Boundary) and Data (Entity)
      expect(isValidConnectionType('control', 'boundary')).toBe(true);
      expect(isValidConnectionType('control', 'entity')).toBe(true);
      expect(isValidConnectionType('control', 'actor')).toBe(false); // Don't skip presentation

      // Data layer (Entity) should only communicate with Business layer (Control)
      expect(isValidConnectionType('entity', 'control')).toBe(true);
      expect(isValidConnectionType('entity', 'boundary')).toBe(false);
      expect(isValidConnectionType('entity', 'actor')).toBe(false);

      // Actor should communicate through Presentation or Business layers
      expect(isValidConnectionType('actor', 'boundary')).toBe(true);
      expect(isValidConnectionType('actor', 'control')).toBe(true);
      expect(isValidConnectionType('actor', 'entity')).toBe(false); // Don't skip to data
    });
  });
});
