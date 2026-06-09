import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import ArchitectHero from './components/aethera/ArchitectHero';
import AboutSection from './components/aethera/AboutSection';
import SkillVault from './components/aethera/SkillVault';
import ProjectsSection from './components/aethera/ProjectsSection';
import ContactSection from './components/aethera/ContactSection';
import CustomCursor from './components/aethera/CustomCursor';
import { useHubStore } from './store/useHubStore';
import './index.css';

// Level Up Banner Component
const LevelUpBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isVisible]);

  return (
    <div ref={observerRef} className="absolute top-0 left-0 w-full h-10 pointer-events-none flex justify-center z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: -50, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute top-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent border-t border-b border-yellow-500/50 px-16 py-4 flex flex-col items-center backdrop-blur-sm"
          >
            <span className="font-space text-sm text-yellow-500 font-black tracking-[0.5em] uppercase animate-pulse drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
              LEVEL 99 REACHED
            </span>
            <span className="font-space text-3xl text-white font-black tracking-tighter uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              CAMPAIGN COMPLETE
            </span>
            {/* Particle Bursts */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  x: (Math.random() - 0.5) * 200, 
                  y: (Math.random() - 0.5) * 200 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)]"
                style={{ top: '50%', left: '50%' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const { isHeroComplete, setIsHeroComplete, setLenis } = useHubStore();

  // ── Lenis Smooth Scroll ───────────────────────────────────
  useEffect(() => {
    if (!isHeroComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isHeroComplete]);

  return (
    <>
      <CustomCursor />
      
      {/* Global Tactical Vignette & Scanline */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-30 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />

      <div 
        className="app-container" 
        style={{ 
          backgroundColor: '#080808', 
          width: '100vw', 
          position: 'relative',
          overflowX: 'hidden',
          overflowY: isHeroComplete ? 'auto' : 'hidden',
          height: isHeroComplete ? 'auto' : '100vh'
        }}
      >
        <ArchitectHero onComplete={(status) => setIsHeroComplete(status)} />
        
        {/* ── Scrollable Content ──────────────────────────────────── */}
        <div className="relative">
          {/* Zone 1: Hero Spacer */}
          <div className="h-screen w-full pointer-events-none" />
          
          {/* Zone 2: About Section (Sticky) */}
          <div className="h-screen w-full relative z-[100]">
            <div className="sticky top-0 h-screen w-full">
              <AboutSection />
            </div>
          </div>

          {/* Zone 3: Skill Vault (Sticky) */}
          <div className="h-screen w-full relative z-[105]">
            <div className="sticky top-0 h-screen w-full">
              <SkillVault />
            </div>
          </div>

          {/* Zone 4: Projects Section */}
          <div className="relative z-[110]">
            <ProjectsSection />
          </div>

          {/* Zone 5: Contact Section with Level Up Trigger */}
          <div className="relative z-[115]">
             <LevelUpBanner />
             <ContactSection />
          </div>
        </div>
      </div>
    </>
  );
}
