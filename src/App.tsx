
import './App.css';
import { ReactFlowProvider } from '@xyflow/react';
import { Header, LeftSidebar, CanvasContainer, RightSidebar, Footer} from './shared';

function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
      <Header />
      <div className="main-content">
        <LeftSidebar />
        <CanvasContainer />
        <RightSidebar />
      </div>
      <Footer />
    </div>
    </ReactFlowProvider>
  );
}

export default App;
