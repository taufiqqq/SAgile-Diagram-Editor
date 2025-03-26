interface UseCaseHtmlProps {
  label?: string;
  width?: number;
  height?: number;
}

export const UseCaseHtml = ({ 
  label, 
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
      border: '2px solid #555',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    {label && <strong>{label}</strong>}
  </div>
);