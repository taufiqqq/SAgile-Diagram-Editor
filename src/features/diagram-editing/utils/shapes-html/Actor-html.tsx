
interface ActorHtmlProps {
  label?: string;
  width?: number;
  selected?: boolean;
}

export const ActorHtml = ({ label, selected, width = 100 }: ActorHtmlProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img  draggable
      width={width} 
      src="/actor.svg" 
      style={{ 
        filter: selected 
        ? 'brightness(0) saturate(100%) invert(21%) sepia(93%) saturate(7473%) hue-rotate(-1deg) brightness(96%) contrast(107%)'
        : 'none',
        width: '100px',
        height: '100px'
      }} 
      alt="Actor Icon" 
      className="actor-icon" 
    />
    {label && <strong>{label}</strong>}
  </div>
);