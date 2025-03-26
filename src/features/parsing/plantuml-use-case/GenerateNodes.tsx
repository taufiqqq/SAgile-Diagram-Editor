// GenerateNodes.ts

// Sample PlantUML input string
const plantUML = `
left to right direction
actor "Luqman" as fc
rectangle Restaurant {
  usecase "Eat Food" as UC1
  usecase "Pay for Food" as UC2
  usecase "Drink" as UC3
}
fc --> UC1
fc --> UC2
fc --> UC3
`;

// Function to parse PlantUML string
function parsePlantUML(umlString: string) {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    const actorRegex = /actor "([^"]+)" as (\w+)/g;
    const usecaseRegex = /usecase "([^"]+)" as (\w+)/g;
    const relationRegex = /(\w+) --> (\w+)/g;
    
    const actorMatches = umlString.matchAll(actorRegex);
    const usecaseMatches = umlString.matchAll(usecaseRegex);
    const relationMatches = umlString.matchAll(relationRegex);
    
    // Generate nodes for actors
    for (const match of actorMatches) {
        const [, name, id] = match;
        nodes.push({ id, position: { x: 0, y: nodes.length * 100  }, type: 'actor', data: { label: name } });
        console.log(name);
    }

    // Generate nodes for use cases
    for (const match of usecaseMatches) {
        const [, name, id] = match;
        nodes.push({ id, position: { x: 200, y: (nodes.length-1) * 120 }, type : 'usecase' , data: { label: name } });
    }

    // Generate edges for relations
    for (const match of relationMatches) {
        const [, source, target] = match;
        edges.push({ id: `e${source}-${target}`, source, target, type: 'straight' });
    }
    
    console.log(nodes);
    console.log(edges);
    return { nodes, edges };
}

// Using the parser to generate ReactFlow compatible structure
const { nodes: initialNodes, edges: initialEdges } = parsePlantUML(plantUML);

export { initialNodes, initialEdges };