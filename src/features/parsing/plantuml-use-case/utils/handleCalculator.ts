import { ShapeNode, HandlePositions, ClosestHandles } from '../types';

export function calculateClosestHandles(sourceNode: ShapeNode, targetNode: ShapeNode): ClosestHandles {
  const sourcePos = sourceNode.position;
  const targetPos = targetNode.position;
  
  const sourceHandles: HandlePositions = {
    left: { x: sourcePos.x - 10, y: sourcePos.y },
    right: { x: sourcePos.x + 10, y: sourcePos.y }
  };
  
  const targetHandles: HandlePositions = {
    left: { x: targetPos.x - 10, y: targetPos.y },
    right: { x: targetPos.x + 10, y: targetPos.y }
  };
  
  let minDistance = Infinity;
  let bestSourceHandle: string = 'right';
  let bestTargetHandle: string = 'left';
  
  for (const [sourceHandle, sourcePoint] of Object.entries(sourceHandles)) {
    for (const [targetHandle, targetPoint] of Object.entries(targetHandles)) {
      const distance = Math.sqrt(
        Math.pow(sourcePoint.x - targetPoint.x, 2) + 
        Math.pow(sourcePoint.y - targetPoint.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        bestSourceHandle = sourceHandle;
        bestTargetHandle = targetHandle;
      }
    }
  }
  
  return { sourceHandle: bestSourceHandle, targetHandle: bestTargetHandle };
} 