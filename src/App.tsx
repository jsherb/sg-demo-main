import React from 'react';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { ProjectHeader } from './components/ProjectHeader';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <TopNav />
      <ProjectHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;