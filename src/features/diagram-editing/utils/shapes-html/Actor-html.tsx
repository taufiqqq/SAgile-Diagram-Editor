
interface ActorHtmlProps {
  label?: string;
  width?: number;
}

export const ActorHtml = ({ label, width = 100 }: ActorHtmlProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img  draggable
      width={width} 
      src="/actor.svg" 
      alt="Actor Icon" 
      className="actor-icon" 
    />
    {label && <strong>{label}</strong>}
  </div>
);