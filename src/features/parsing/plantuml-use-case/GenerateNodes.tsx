// GenerateNodes.ts
import { ShapeNode } from '../../diagram-editing/types/NodeTypes.types';

// Sample PlantUML input string
const plantUML = `
left to right direction

actor "Project Manager"

rectangle sprintDebug {
	usecase "devd"
	usecase "eat"
	usecase "drink"
	usecase "tak haus"
}

"Project Manager" --> "devd"
"Project Manager" --> "eat"
"Project Manager" --> "tak haus"
"tak haus" .> "drink" : include
`;

// Function to parse PlantUML string
function parsePlantUML(umlString: string) {
    const nodes: ShapeNode[] = [];
    const edges: any[] = [];
    const nodeMap = new Map<string, string>(); // Maps node names to IDs
    const processedUsecases = new Set<string>(); // Track which use cases have been processed

    // Extract direction
    const directionMatch = umlString.match(/left to right direction/);
    const isLeftToRight = !!directionMatch;

    // Extract actors - match format: actor "Name"
    const actorRegex = /actor\s+"([^"]+)"/g;
    let actorIdCounter = 1;
    
    for (const match of umlString.matchAll(actorRegex)) {
        const [, name] = match;
        const id = `actor_${actorIdCounter++}`;
        nodeMap.set(name, id);
        
        nodes.push({
            id,
            position: { x: isLeftToRight ? -100 : 0, y: nodes.length * 100 },
            type: 'shape',
            data: { type: 'actor', label: name }
        });
    }

    // Extract use cases within rectangles
    const rectangleRegex = /rectangle\s+(\w+)\s*{([^}]*)}/g;
    const usecaseRegex = /usecase\s+"([^"]+)"/g;
    let usecaseIdCounter = 1;
    
    for (const rectangleMatch of umlString.matchAll(rectangleRegex)) {
        const [, rectangleName, rectangleContent] = rectangleMatch;
        
        // Process use cases within this rectangle
        for (const usecaseMatch of rectangleContent.matchAll(usecaseRegex)) {
            const [, name] = usecaseMatch;
            
            // Skip if this use case has already been processed
            if (processedUsecases.has(name)) continue;
            
            const id = `usecase_${usecaseIdCounter++}`;
            nodeMap.set(name, id);
            processedUsecases.add(name);
            
            nodes.push({
                id,
                position: { x: isLeftToRight ? 200 : 0, y: (nodes.length - 1) * 120 },
                type: 'shape',
                data: { type: 'usecase', label: name }
            });
        }
    }

    // Extract standalone use cases (not in rectangles)
    const standaloneUsecaseRegex = /usecase\s+"([^"]+)"/g;
    for (const match of umlString.matchAll(standaloneUsecaseRegex)) {
        const [, name] = match;
        
        // Skip if this use case has already been processed
        if (processedUsecases.has(name)) continue;
        
        const id = `usecase_${usecaseIdCounter++}`;
        nodeMap.set(name, id);
        processedUsecases.add(name);
        
        nodes.push({
            id,
            position: { x: isLeftToRight ? 200 : 0, y: (nodes.length - 1) * 120 },
            type: 'shape',
            data: { type: 'usecase', label: name }
        });
    }

    // Extract relationships - match format: "Source" --> "Target"
    const relationRegex = /"([^"]+)"\s+-->\s+"([^"]+)"/g;
    
    for (const match of umlString.matchAll(relationRegex)) {
        const [, source, target] = match;
        const sourceId = nodeMap.get(source);
        const targetId = nodeMap.get(target);
        
        if (sourceId && targetId) {
            edges.push({
                id: `e${sourceId}-${targetId}`,
                source: sourceId,
                target: targetId,
                type: 'straight',
                sourceHandle: isLeftToRight ? 'right' : 'bottom',
                targetHandle: isLeftToRight ? 'left' : 'top'
            });
        }
    }

    console.log("Parsed nodes:", nodes);
    console.log("Parsed edges:", edges);
    return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges, parsePlantUML };