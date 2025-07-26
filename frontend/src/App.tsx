import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LegalAdvisor from './pages/LegalAdvisor';
import AppealGenerator from './pages/AppealGenerator';
import SupportDirectory from './pages/SupportDirectory';
import CaseStories from './pages/CaseStories';
import StoryWall from './pages/StoryWall';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/legal-advisor" element={<LegalAdvisor setIsLoading={setIsLoading} />} />
            <Route path="/appeal-generator" element={<AppealGenerator setIsLoading={setIsLoading} />} />
            <Route path="/support-directory" element={<SupportDirectory />} />
            <Route path="/case-stories" element={<CaseStories />} />
            <Route path="/story-wall" element={<StoryWall setIsLoading={setIsLoading} />} />
          </Routes>
        </main>
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your request...</p>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
