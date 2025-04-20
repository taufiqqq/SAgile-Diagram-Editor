import React, { useState } from 'react';

interface UseCaseSpecificationsProps {
  specifications: string[];
  onChange: (specifications: string[]) => void;
}

export const UseCaseSpecifications: React.FC<UseCaseSpecificationsProps> = ({
  specifications = [],
  onChange,
}) => {
  const addNewField = () => {
    onChange([...specifications, '']);
  };

  const updateField = (index: number, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = value;
    onChange(newSpecs);
  };

  const removeField = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    onChange(newSpecs);
  };

  return (
    <div style={{ 
      padding: "24px 32px",
      minHeight: "100%",
      backgroundColor: "white"
    }}>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "12px",
          fontSize: "14px",
          color: "#374151",
          fontWeight: 500
        }}>
          Sequence Steps
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {specifications.map((spec, index) => (
            <div key={index} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={spec}
                onChange={(e) => updateField(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "white",
                  outline: "none",
                }}
              />
              <button
                onClick={() => removeField(index)}
                style={{
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1",
                  transition: "all 0.2s ease",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={addNewField}
          style={{
            padding: "8px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            backgroundColor: "white",
            color: "#374151",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: "16px", lineHeight: "1" }}>+</span>
          Add Step
        </button>

        <button
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#3b82f6",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.2s ease",
          }}
        >
          Generate Sequence Diagram
        </button>
      </div>
    </div>
  );
}; 