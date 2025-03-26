import { MiniMap, Background, Controls } from '@xyflow/react';

export function FlowControls() {
    return (
        <>
            <MiniMap nodeStrokeWidth={10} />
            <Background />
            <Controls />
        </>
    );
}