interface UseCaseHtmlProps {
  label?: string;
  selected?: boolean;
  width?: number;
  height?: number;
}

export const UseCaseHtml = ({ 
  label, 
  selected,
  width = 150, 
  height = 100 
}: UseCaseHtmlProps) => (
  <div
  draggable
    style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '50%',
      background: '#f0f0f0',
      border: selected? '2px solid red' : '2px solid #555',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    {label && <strong>{label}</strong>}
  </div>
);