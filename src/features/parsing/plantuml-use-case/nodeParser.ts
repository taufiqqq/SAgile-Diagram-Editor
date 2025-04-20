import { ShapeNode, NodeMap } from './types';

export function parseNodes(umlString: string, isLeftToRight: boolean): { nodes: ShapeNode[], nodeMap: NodeMap } {
  const nodes: ShapeNode[] = [];
  const nodeMap: NodeMap = {};
  const processedUsecases = new Set<string>();
  const includeRelations = new Set<string>();

  // First, find all include relationships to identify included use cases
  const findIncludeRegex = /"([^"]+)"\s+\.>\s+"([^"]+)"\s*:\s*include/g;
  for (const match of umlString.matchAll(findIncludeRegex)) {
    const [, , target] = match;
    includeRelations.add(target);
  }

  // Extract actors
  const actorRegex = /actor\s+"([^"]+)"/g;
  let actorIdCounter = 1;
  let currentY = 0;

  for (const match of umlString.matchAll(actorRegex)) {
    const [, name] = match;
    const id = `actor_${actorIdCounter++}`;
    nodeMap[name] = id;

    nodes.push({
      id,
      position: { x: isLeftToRight ? -100 : 0, y: currentY },
      type: "shape",
      data: { type: "actor", label: name },
    });
  }

  // Extract use cases within rectangles
  const rectangleRegex = /rectangle\s+(\w+)\s*{([^}]*)}/g;
  const usecaseRegex = /usecase\s+"([^"]+)"/g;
  let usecaseIdCounter = 1;
  let baseX = isLeftToRight ? 200 : 0;

  for (const rectangleMatch of umlString.matchAll(rectangleRegex)) {
    const [, rectangleName, rectangleContent] = rectangleMatch;

    for (const usecaseMatch of rectangleContent.matchAll(usecaseRegex)) {
      const [, name] = usecaseMatch;

      if (processedUsecases.has(name)) continue;

      const id = `usecase_${usecaseIdCounter++}`;
      nodeMap[name] = id;
      processedUsecases.add(name);

      const x = includeRelations.has(name) ? baseX + 300 : baseX;

      nodes.push({
        id,
        position: { x, y: currentY },
        type: "shape",
        data: { type: "usecase", label: name },
      });

      if (!includeRelations.has(name)) {
        currentY += 120;
      }
    }
  }

  // Extract standalone use cases
  const standaloneUsecaseRegex = /usecase\s+"([^"]+)"/g;
  for (const match of umlString.matchAll(standaloneUsecaseRegex)) {
    const [, name] = match;

    if (processedUsecases.has(name)) continue;

    const id = `usecase_${usecaseIdCounter++}`;
    nodeMap[name] = id;
    processedUsecases.add(name);

    const x = includeRelations.has(name) ? baseX + 300 : baseX;

    nodes.push({
      id,
      position: { x, y: currentY },
      type: "shape",
      data: { type: "usecase", label: name },
    });

    if (!includeRelations.has(name)) {
      currentY += 120;
    }
  }

  return { nodes, nodeMap };
} 