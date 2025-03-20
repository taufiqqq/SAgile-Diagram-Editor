import React from 'react';
import Header from './sections/Header';
import Canvas from './sections/CanvasContainer';
import LeftSidebar from './sections/LeftSidebar';
import RightSidebar from './sections/RightSidebar';
import Footer from './sections/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
}

export default App;
