import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { DnDProvider } from './features/diagram-editing';
import { ModalProvider } from './shared/context/ModalContext';
import { UseCaseModal } from './shared/components/UseCaseModal';
import Canvas from './shared/components/CanvasContainer';

function App() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/:projectId/:sprintId" element={
            <div style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              flex: 1
            }}>
              <ReactFlowProvider>
                <ModalProvider>
                  <DnDProvider>
                    <Canvas />
                    <UseCaseModal />
                  </DnDProvider>
                </ModalProvider>
              </ReactFlowProvider>
            </div>
          } />
          <Route path="/" element={
            <div style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              flex: 1
            }}>
              <ReactFlowProvider>
                <ModalProvider>
                  <DnDProvider>
                    <Canvas />
                    <UseCaseModal />
                  </DnDProvider>
                </ModalProvider>
              </ReactFlowProvider>
            </div>
          } />
        </Routes>
      </Router>
    </div>
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