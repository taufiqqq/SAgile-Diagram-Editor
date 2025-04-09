import './App.css';
import { DnDProvider } from './features/diagram-editing';
import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './shared/components/CanvasContainer';
import { ModalProvider } from './shared/context/ModalContext';
import { GlobalModal } from './shared/components/GlobalModal';

function App() {

  //TODO: recheck issit correct to put in this file or better in other file
  // const canCopy = nodes.some(({ selected }) => selected);
  // const canPaste = bufferedNodes.length > 0;

  return (
    <ReactFlowProvider>
      <ModalProvider>
        <DnDProvider>
          <Canvas />
          <GlobalModal />
        </DnDProvider>
      </ModalProvider>
    </ReactFlowProvider>
  );
}

export default App;

/* <Panel className={styles.buttonGroup} position="top-left">
        <button
          className={styles.button}
          onClick={() => cut()}
          disabled={!canCopy}
        >
          cut
        </button>
        <button
          className={styles.button}
          onClick={() => copy()}
          disabled={!canCopy}
        >
          copy
        </button>
        <button
          className={styles.button}
          onClick={() => paste({ x: 0, y: 0 })}
          disabled={!canPaste}
        >
          paste
        </button>
      </Panel> */