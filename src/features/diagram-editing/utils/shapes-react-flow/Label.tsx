import React, { useState, useEffect, CSSProperties, useRef } from 'react';

interface NodeLabelProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  style?: CSSProperties;
  hidePlaceholder?: boolean;
}

function NodeLabel({ 
  placeholder, 
  value: initialValue = '', 
  onChange, 
  readOnly = false,
  style = {},
  hidePlaceholder = false
}: NodeLabelProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Auto-resize textarea when content changes
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className='node-label'
          placeholder={hidePlaceholder ? '' : placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={handleClick}
          readOnly={readOnly}
          style={{ 
            border: '1px solid #3F8AE2',
            background: 'white',
            padding: '1px 2px',
            borderRadius: '3px',
            width: '80%',
            minWidth: '80px',
            maxWidth: '150px',
            minHeight: '12px',
            maxHeight: '100px',
            textAlign: 'center',
            resize: 'none',
            overflow: 'hidden',
            cursor: readOnly ? 'default' : 'text',
            color: '#000000',
    lineHeight: "1.2", // Adjust line height
            ...style
          }}
        />
      ) : (
        <div
          className='node-label'
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          style={{ 
            border: 'none',
            background: 'transparent',
            padding: '0',
            borderRadius: '3px',
            width: '80%',
            minWidth: '80px',
            maxWidth: '150px',
            textAlign: 'center',
            cursor: readOnly ? 'default' : 'pointer',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: value ? '#000000' : (hidePlaceholder ? 'transparent' : '#888888'),
            ...style
          }}
        >
          {value || (hidePlaceholder ? '' : placeholder)}
        </div>
      )}
    </div>
  );
}

export default NodeLabel;
  