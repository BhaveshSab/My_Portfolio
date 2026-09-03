import React, { Suspense, lazy } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

// Lazy load non-critical sections for performance
const FrameScrollAnimation = lazy(() => import('./components/FrameScrollAnimation'));
const About = lazy(() => import('./components/About'));
const TechStackOrbit = lazy(() => import('./components/TechStackOrbit'));
const EducationMilestonesTimeline = lazy(() => import('./components/EducationMilestonesTimeline'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const SectionSeam = lazy(() => import('./components/SectionSeam'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      
      <Suspense fallback={<div className="h-screen bg-black" />}>
        {/* Welcome to Portfolio — laptop cinematic (240 frames) */}
        <FrameScrollAnimation frameCount={240} />
        <About />
        {/* Animated gold seams so black-to-black section cuts read as deliberate transitions */}
        <SectionSeam />
        <TechStackOrbit />
        <SectionSeam />
        <Portfolio />
        <SectionSeam />
        <EducationMilestonesTimeline />
        {/* Animated gold seam into the Let's-Build bloom — the last section
            without a designed hand-off (only ~62px separated them before) */}
        <SectionSeam />
        {/* Interactive skill matrix + COMM_LINK — the bloom scrolls over the
            telephone backdrop, then the right-aligned gold form takes over */}
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
