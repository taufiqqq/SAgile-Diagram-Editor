import { MiniMap, Background, Controls } from '@xyflow/react';

export function FlowControls() {
    return (
        <>
            <MiniMap nodeStrokeWidth={10} zoomStep = {0.1}/>
            <Background />
            <Controls />
        </>
    );
}