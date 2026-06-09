import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHubStore } from '../../store/useHubStore';

const PROJECTS = [
  {
    id: "mission_01",
    title: "E-COMMERCE RAID",
    stack: "React | Three.js | Zustand",
    description: "A high-conversion tactical storefront. We replaced standard scrolling with a gamified progression system, resulting in a 40% increase in user retention.",
    image: "/assets/island_1.png"
  },
  {
    id: "mission_02",
    title: "FINTECH BASTION",
    stack: "Security | WebGL | Motion",
    description: "An immersive dashboard that turns complex financial data into a command center experience. Built for elite-level throughput and zero-friction onboarding.",
    image: "/assets/island_2.png"
  },
  {
    id: "mission_03",
    title: "SAAS FRONTIER",
    stack: "Next.js | Tailwind | GSAP",
    description: "A sprawling B2B landing page campaign. Optimized for surgical market precision, featuring cinematic scroll-jacking and tactical UI elements.",
    image: "/assets/island_3.png"
  }
];

// Loot Drop Component
const LootDropWrapper = ({ children }) => {
  const [drops, setDrops] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spawn 3-5 drops
    const numDrops = Math.floor(Math.random() * 3) + 3;
    const newDrops = Array.from({ length: numDrops }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      type: Math.random() > 0.5 ? 'gold' : 'elixir',
      delay: i * 0.1
    }));
    
    setDrops(prev => [...prev, ...newDrops]);
    
    setTimeout(() => {
      setDrops(prev => prev.filter(d => !newDrops.find(nd => nd.id === d.id)));
    }, 1500);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      {children}
      <AnimatePresence>
        {drops.map(drop => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 1, y: drop.y, x: drop.x, scale: 0 }}
            animate={{ 
              opacity: 0, 
              y: drop.y - 100 - (Math.random() * 50), 
              x: drop.x + (Math.random() * 100 - 50), 
              scale: 1.5 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: drop.delay }}
            className="absolute z-50 pointer-events-none w-6 h-6"
            style={{ left: 0, top: 0 }}
          >
            {drop.type === 'gold' ? (
              <div className="w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            ) : (
              <div className="w-full h-full bg-fuchsia-500 rounded-full border-2 border-fuchsia-700 shadow-[0_0_10px_rgba(217,70,239,0.8)]" style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const ProjectsSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const indexRef = useRef(0);
  const scrollAccumulator = useRef(0);
  const sectionRef = useRef(null);
  const mountTime = useRef(Date.now());
  
  const { lenis } = useHubStore();
  const project = PROJECTS[index];

  useEffect(() => {
    mountTime.current = Date.now();
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current || !lenis) return;
      
      // Debounce the initial entry
      if (Date.now() - mountTime.current < 1000) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top <= 2) {
           lenis.stop();
           if (e.cancelable) e.preventDefault();
        }
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top <= 5 && rect.bottom >= window.innerHeight - 5;
      
      if (!isVisible) return;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isAtFirst = indexRef.current === 0;
      const isAtLast = indexRef.current === PROJECTS.length - 1;
      
      const shouldRelease = (isAtFirst && isScrollingUp) || (isAtLast && isScrollingDown);

      if (!shouldRelease) {
        lenis.stop();
        if (e.cancelable) e.preventDefault();
        
        scrollAccumulator.current += e.deltaY;
        
        if (Math.abs(scrollAccumulator.current) > 120) {
          if (!isAnimatingRef.current) {
            if (isScrollingDown && !isAtLast) {
              setDirection(1);
              changeProject(indexRef.current + 1);
            } else if (isScrollingUp && !isAtFirst) {
              setDirection(-1);
              changeProject(indexRef.current - 1);
            }
          }
          scrollAccumulator.current = 0;
        }
      } else {
        lenis.start();
      }
    };

    const changeProject = (newIndex) => {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setIndex(newIndex);
      indexRef.current = newIndex;
      
      setTimeout(() => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }, 800); // Lock for 800ms to allow animation to finish
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [lenis]);

  return (
    <section 
      ref={sectionRef}
      className="w-full h-screen relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* ── BACKGROUND MAP ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/projects_bg.png" 
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]" 
          alt="Campaign Map" 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── MINIMIZED MISSION LOG (FAR LEFT) ───────────────────────── */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6">
        {PROJECTS.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-2">
            <div className="relative">
              <img 
                src={p.image} 
                className={`w-10 h-10 object-contain border rounded-full p-1 transition-all duration-500 ${
                  i <= index ? "grayscale-0 brightness-100 border-yellow-500/40" : "grayscale brightness-50 border-white/10"
                }`}
              />
            </div>
            <div className="w-[1px] h-8 bg-white/10 last:hidden" />
          </div>
        ))}
      </div>

      {/* ── CONTENT CONTAINER ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl px-12 md:px-24 h-full flex flex-col justify-center">
        
        {/* WAR LOG HEADER */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full">
          <div className="flex items-center gap-6">
              <div className="w-16 h-1 bg-yellow-500/20 rounded-full" />
              <span className="font-space text-[10px] tracking-[0.7em] text-yellow-500 font-black uppercase">CONQUERED_TERRITORIES</span>
              <div className="w-16 h-1 bg-yellow-500/20 rounded-full" />
          </div>
          <h2 className="font-space text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            PAST <span className="text-yellow-500">CAMPAIGNS</span>
          </h2>
        </div>

        {/* ACTIVE MISSION DISPLAY */}
        <div className="relative w-full flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div 
              key={project.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 w-full"
            >
              {/* Left: Image with Loot Drop */}
              <LootDropWrapper>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] flex-shrink-0"
                >
                  <img 
                    src={project.image} 
                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]" 
                    alt={project.title} 
                  />
                </motion.div>
              </LootDropWrapper>

              {/* Right: Info */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg gap-4">
                 <div className="flex flex-col gap-1">
                    <span className="font-space text-[10px] text-yellow-500/60 font-black tracking-[0.4em] uppercase">Service_Overview</span>
                    <h3 className="font-space text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                      {project.title}
                    </h3>
                 </div>
                 
                 <div className="h-px w-24 bg-yellow-500/40" />
                 
                 <p className="font-serif text-white/80 text-lg md:text-xl italic leading-relaxed drop-shadow-md">
                    "{project.description}"
                 </p>

                 <div className="flex flex-col gap-1 mt-4">
                    <span className="font-space text-[10px] text-white/30 font-black tracking-[0.4em] uppercase">Capabilities</span>
                    <span className="font-space text-sm text-yellow-500 font-black tracking-[0.2em] uppercase">
                      {project.stack}
                    </span>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* ── SCANLINE OVERLAY ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-10" />
    </section>
  );
};

export default ProjectsSection;
