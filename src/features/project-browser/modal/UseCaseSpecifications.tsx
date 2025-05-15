import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { DiagramUseCaseSpecificationService } from '../../../backend/services/DiagramUseCaseSpecificationService';

export type FlowType = 'NORMAL' | 'ALTERNATIVE' | 'EXCEPTION';

interface FlowStep {
  id: string;
  description: string;
}

interface SequenceFlow {
  id: string;
  type: FlowType;
  name: string;
  entry_point?: string;
  exit_point?: string;
  steps: FlowStep[];
}

interface SpecificationsData {
  preconditions: string[];
  postconditions: string[];
  flows: SequenceFlow[];
}

interface UseCaseSpecificationsProps {
  specifications: SpecificationsData;
  onChange: (changes: Partial<SpecificationsData>) => void;
  useCaseId: string;
  onSave?: () => void;
}

export const UseCaseSpecifications: React.FC<UseCaseSpecificationsProps> = ({ 
  specifications, 
  onChange,
  useCaseId,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'PREPOST' | string>('PREPOST');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddFlow = (type: FlowType) => {
    const newFlow: SequenceFlow = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      name: type === 'ALTERNATIVE' ? 'Alternative flow' : 'Exception flow',
      entry_point: '',
      exit_point: '',
      steps: [{ id: `step-1`, description: '' }],
    };
    onChange({ flows: [...specifications.flows, newFlow] });
    setActiveTab(newFlow.id);
  };

  const handleAddStep = (flowId: string) => {
    onChange({
      flows: specifications.flows.map(flow =>
        flow.id === flowId
          ? { ...flow, steps: [...flow.steps, { id: `step-${flow.steps.length + 1}`, description: '' }] }
          : flow
      )
    });
  };

  const handleStepChange = (flowId: string, stepIdx: number, value: string) => {
    onChange({
      flows: specifications.flows.map(flow =>
        flow.id === flowId
          ? {
              ...flow,
              steps: flow.steps.map((step, idx) => idx === stepIdx ? { ...step, description: value } : step)
            }
          : flow
      )
    });
  };

  const handleRemoveStep = (flowId: string, stepIdx: number) => {
    onChange({
      flows: specifications.flows.map(flow =>
        flow.id === flowId
          ? { ...flow, steps: flow.steps.filter((_, idx) => idx !== stepIdx) }
          : flow
      )
    });
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={{
              border: 'none',
              background: activeTab === 'PREPOST' ? '#2563eb' : '#f3f4f6',
              color: activeTab === 'PREPOST' ? '#fff' : '#222',
              padding: '8px 20px',
              borderRadius: 999,
              marginRight: 10,
              fontWeight: 500,
              fontSize: 15,
              boxShadow: activeTab === 'PREPOST' ? '0 2px 8px #2563eb22' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}
            onClick={() => setActiveTab('PREPOST')}
          >
            Pre&Post condition
          </button>
          {specifications.flows.map(flow => (
            <button
              key={flow.id}
              style={{
                border: 'none',
                background: activeTab === flow.id ? '#2563eb' : '#f3f4f6',
                color: activeTab === flow.id ? '#fff' : '#222',
                padding: '8px 20px',
                borderRadius: 999,
                marginRight: 10,
                fontWeight: 500,
                fontSize: 15,
                boxShadow: activeTab === flow.id ? '0 2px 8px #2563eb22' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
              onClick={() => setActiveTab(flow.id)}
            >
              {flow.name}
            </button>
          ))}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              style={{
                border: 'none',
                background: '#f3f4f6',
                color: '#2563eb',
                padding: '8px 16px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 20,
                marginLeft: 2,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2563eb11',
                transition: 'background 0.2s, color 0.2s'
              }}
              onClick={() => setShowDropdown(d => !d)}
              title="Add flow"
            >
              +
            </button>
            {showDropdown && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                background: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: 8, 
                zIndex: 1000, 
                minWidth: 160, 
                boxShadow: '0 2px 8px #0001',
                marginTop: 4
              }}>
                <div 
                  style={{ 
                    padding: 12, 
                    cursor: 'pointer', 
                    fontSize: 15, 
                    color: '#2563eb', 
                    fontWeight: 500
                  }} 
                  onClick={() => { handleAddFlow('ALTERNATIVE'); setShowDropdown(false); }}
                >
                  Alternative Flow
                </div>
                <div 
                  style={{ 
                    padding: 12, 
                    cursor: 'pointer', 
                    fontSize: 15, 
                    color: '#ef4444', 
                    fontWeight: 500
                  }} 
                  onClick={() => { handleAddFlow('EXCEPTION'); setShowDropdown(false); }}
                >
                  Exception Flow
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'PREPOST' && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, marginBottom: 10, display: 'block', fontSize: 16 }}>Preconditions</label>
            {specifications.preconditions.map((cond, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <input
                  type="text"
                  value={cond}
                  onChange={e => onChange({
                    preconditions: specifications.preconditions.map((c, i) => i === idx ? e.target.value : c)
                  })}
                  style={{
                    flex: 1,
                    marginRight: 8,
                    background: '#fff',
                    color: '#222',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 15
                  }}
                  placeholder={`Precondition ${idx + 1}`}
                />
                <button
                  onClick={() => onChange({
                    preconditions: specifications.preconditions.filter((_, i) => i !== idx)
                  })}
                  style={{
                    color: '#ef4444',
                    border: 'none',
                    background: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                    marginLeft: 2
                  }}
                  title="Remove"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => onChange({
                preconditions: [...specifications.preconditions, '']
              })}
              style={{
                marginTop: 8,
                fontSize: 15,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2563eb22',
                transition: 'background 0.2s, color 0.2s',
                marginBottom: 8
              }}
            >+ Add precondition</button>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 10, display: 'block', fontSize: 16 }}>Postconditions</label>
            {specifications.postconditions.map((cond, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <input
                  type="text"
                  value={cond}
                  onChange={e => onChange({
                    postconditions: specifications.postconditions.map((c, i) => i === idx ? e.target.value : c)
                  })}
                  style={{
                    flex: 1,
                    marginRight: 8,
                    background: '#fff',
                    color: '#222',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 15
                  }}
                  placeholder={`Postcondition ${idx + 1}`}
                />
                <button
                  onClick={() => onChange({
                    postconditions: specifications.postconditions.filter((_, i) => i !== idx)
                  })}
                  style={{
                    color: '#ef4444',
                    border: 'none',
                    background: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                    marginLeft: 2
                  }}
                  title="Remove"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => onChange({
                postconditions: [...specifications.postconditions, '']
              })}
              style={{
                marginTop: 8,
                fontSize: 15,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2563eb22',
                transition: 'background 0.2s, color 0.2s',
                marginBottom: 8
              }}
            >+ Add postcondition</button>
          </div>
        </div>
      )}

      {activeTab !== 'PREPOST' && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, marginBottom: 10, display: 'block', fontSize: 16 }}>Sequence Steps</label>
            {specifications.flows.find(f => f.id === activeTab)?.steps.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <input
                  type="text"
                  value={step.description}
                  onChange={e => handleStepChange(activeTab, idx, e.target.value)}
                  style={{
                    flex: 1,
                    marginRight: 8,
                    background: '#fff',
                    color: '#222',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 15
                  }}
                  placeholder={`Step ${idx + 1}`}
                />
                <button
                  onClick={() => handleRemoveStep(activeTab, idx)}
                  style={{
                    color: '#ef4444',
                    border: 'none',
                    background: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                    marginLeft: 2
                  }}
                  title="Remove"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => handleAddStep(activeTab)}
              style={{
                marginTop: 8,
                fontSize: 15,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #2563eb22',
                transition: 'background 0.2s, color 0.2s'
              }}
            >+ Add step</button>
          </div>
        </div>
      )}
    </div>
  );
}; 