import React from 'react';
import { UseCaseData } from '../../diagram-editing/types/UseCaseTypes';

interface UseCaseDetailsFormProps {
  data: UseCaseData;
  onChange: (data: Partial<UseCaseData>) => void;
}

const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div style={{ marginBottom: "24px" }}>
    <label style={{ 
      display: "block", 
      marginBottom: "8px",
      fontSize: "13px",
      color: "#666",
      fontWeight: 500
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#333",
  backgroundColor: "white",
  transition: "all 0.2s ease",
  outline: "none",
};

const readOnlyStyle = {
  ...inputStyle,
  backgroundColor: "#f9fafb",
  color: "#666",
  cursor: "default",
};

export const UseCaseDetailsForm: React.FC<UseCaseDetailsFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div style={{ 
      padding: "24px 32px",
      minHeight: "100%",
      backgroundColor: "white"
    }}>
      <FormField label="Name">
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          style={inputStyle}
          placeholder="Enter name..."
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          style={{
            ...inputStyle,
            height: "120px",
            resize: "none",
          }}
          placeholder="This use case is ..."
        />
      </FormField>

      <FormField label="Version">
        <input
          type="text"
          value={data.version}
          onChange={(e) => onChange({ version: e.target.value })}
          style={inputStyle}
          placeholder="1.0"
        />
      </FormField>

      <FormField label="Created">
        <input
          type="text"
          value={data.created}
          readOnly
          style={readOnlyStyle}
        />
      </FormField>

      <FormField label="Modified">
        <input
          type="text"
          value={data.modified}
          readOnly
          style={readOnlyStyle}
        />
      </FormField>
    </div>
  );
}; 