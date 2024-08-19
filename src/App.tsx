import React from 'react';
import Header from './components/Header';
import Canvas from './components/CanvasContainer';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
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
