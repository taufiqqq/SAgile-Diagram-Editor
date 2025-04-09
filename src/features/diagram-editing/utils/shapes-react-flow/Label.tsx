import React, { useState, useEffect, CSSProperties } from 'react';

interface NodeLabelProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  style?: CSSProperties;
}

function NodeLabel({ 
  placeholder, 
  value: initialValue = '', 
  onChange, 
  readOnly = false,
  style = {}
}: NodeLabelProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Stop propagation only when double-clicking to edit
    e.stopPropagation();
    if (!readOnly) {
      setIsEditing(true);
    }
  };

  // Allow single clicks to propagate to the parent node
  const handleClick = (e: React.MouseEvent) => {
    // Only stop propagation if we're in editing mode
    if (isEditing) {
      e.stopPropagation();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%' 
    }}>
      <input
        type='text'
        className='node-label'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        readOnly={readOnly || !isEditing}
        style={{ 
          border: isEditing ? '1px solid #3F8AE2' : 'none',
          background: isEditing ? 'white' : 'transparent',
          padding: isEditing ? '2px 4px' : '0',
          borderRadius: '3px',
          width: '80%',
          minWidth: '80px',
          maxWidth: '150px',
          textAlign: 'center',
          cursor: readOnly ? 'default' : 'pointer',
          ...style
        }}
      />
    </div>
  );
}

export default NodeLabel;
  