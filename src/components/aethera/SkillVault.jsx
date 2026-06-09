import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHubStore } from '../../store/useHubStore';

const SKILL_GROUPS = [
  {
    id: 'foundation',
    title: "3D WEBGL",
    color: "#FFD700", // Gold
    level: 14,
    stats: [
      { label: "Render Precision", stars: 3, val: "ELITE" },
      { label: "Optimization", stars: 3, val: "MAX" },
      { label: "Immersion", val: "INFINITE", type: 'text' }
    ],
    skills: ["Three.js", "React Three Fiber", "Custom Shaders", "GLSL"],
    image: "/assets/rock_link_orange.png",
    description: "Transforming flat browsers into fully rendered 3D environments. We build worlds that your users can physically explore."
  },
  {
    id: 'frontend',
    title: "TACTICAL DESIGN",
    color: "#00F5FF", // Aether Cyan
    level: 12,
    stats: [
      { label: "UI Weaponry", stars: 3, val: "MAX" },
      { label: "Visual Hierarchy", stars: 3, val: "MAX" },
      { label: "Conversion Rate", val: "CRITICAL", type: 'text' }
    ],
    skills: ["Framer Motion", "GSAP", "TailwindCSS", "CSS Architecture"],
    image: "/assets/rock_link_blue.png",
    description: "Interfaces built for combat. High-contrast, highly legible, and engineered to drive user action without friction."
  },
  {
    id: 'backend',
    title: "GAMIFIED SYSTEMS",
    color: "#FF3131", // Crimson
    level: 13,
    stats: [
      { label: "Engagement Loops", stars: 3, val: "MAX" },
      { label: "State Management", stars: 3, val: "MAX" },
      { label: "Addiction Metric", val: "ULTRA", type: 'text' }
    ],
    skills: ["Zustand", "Progress Systems", "Micro-interactions", "Loot Mechanics"],
    image: "/assets/rock_link_red.png",
    description: "We don't just build features; we build loops. Integrating XP, leveling, and reward systems directly into your product's core loop."
  },
  {
    id: 'data',
    title: "MOTION ARCHITECTURE",
    color: "#D400FF", // Purple
    level: 11,
    stats: [
      { label: "Kinetic Flow", stars: 3, val: "MAX" },
      { label: "Scroll Control", stars: 3, val: "MAX" },
      { label: "Impact", val: "HEAVY", type: 'text' }
    ],
    skills: ["Lenis Smooth Scroll", "ScrollTriggers", "Parallax Engines", "Spring Physics"],
    image: "/assets/rock_link_purple.png",
    description: "Perpetual motion that keeps the user engaged. From heavy, cinematic scroll-jacking to lightweight spring physics."
  }
];

// XP Hover Component
const HoverXPItem = ({ children }) => {
  const [xpDrops, setXpDrops] = useState([]);

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newDrop = { id: Date.now() + Math.random(), x, y };
    setXpDrops(prev => [...prev, newDrop]);
    
    setTimeout(() => {
      setXpDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, 1000);
  };

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={handleHover}
    >
      {children}
      <AnimatePresence>
        {xpDrops.map(drop => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 1, y: drop.y, x: drop.x, scale: 0.5 }}
            animate={{ opacity: 0, y: drop.y - 40, x: drop.x + (Math.random() * 20 - 10), scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute z-50 pointer-events-none font-space font-black text-yellow-400 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
            style={{ left: 0, top: 0 }}
          >
            +{Math.floor(Math.random() * 50) + 50} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const SkillVault = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const scrollProgressRef = useRef(0);
  const sectionRef = useRef(null);
  const mountTime = useRef(Date.now());
  
  const { lenis } = useHubStore();
  const selectedGroup = SKILL_GROUPS.find(g => g.id === selectedId);

  useEffect(() => {
    mountTime.current = Date.now();
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current || !lenis || selectedId) return;

      if (Date.now() - mountTime.current < 1500) {
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
      
      const isAtStart = scrollProgressRef.current <= 0;
      const isAtEnd = scrollProgressRef.current >= 1;
      
      const shouldRelease = (isAtStart && isScrollingUp) || (isAtEnd && isScrollingDown);

      if (!shouldRelease) {
        lenis.stop();
        if (e.cancelable) e.preventDefault();
        
        // Sensitivity: adjust this for faster/slower scroll feel
        const sensitivity = 0.0015;
        const nextProgress = Math.max(0, Math.min(1, scrollProgressRef.current + e.deltaY * sensitivity));
        
        if (nextProgress !== scrollProgressRef.current) {
          scrollProgressRef.current = nextProgress;
          setScrollProgress(nextProgress);
        }
      } else {
        lenis.start();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => { 
      window.removeEventListener('wheel', handleWheel);
      if (lenis) lenis.start(); 
    };
  }, [lenis, selectedId]);

  const getDiamondPos = (index) => {
    const d = 160; 
    switch(index) {
      case 0: return { x: 0, y: -d }; // Top
      case 1: return { x: -d, y: 0 }; // Left
      case 2: return { x: d, y: 0 };  // Right
      case 3: return { x: 0, y: d };  // Bottom
      default: return { x: 0, y: 0 };
    }
  };

  const StarRating = ({ count }) => (
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`w-4 h-4 md:w-5 md:h-5 ${i < count ? 'text-yellow-500' : 'text-white/10'}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section 
      ref={sectionRef}
      onClick={() => setSelectedId(null)}
      className="w-full h-screen relative bg-[#080808] flex flex-col items-center justify-center overflow-hidden cursor-default"
    >
      {/* ── VIBRANT CLASH BACKGROUND ────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/assets/skills.png" 
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] scale-105" 
          alt="Clash Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <motion.div 
        animate={{ 
          y: selectedId ? -150 : 0,
          scale: selectedId ? 0.7 : 1,
          opacity: selectedId ? 0.4 : 1
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-16 left-12 md:left-24 z-30 pointer-events-none origin-left"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-yellow-500/40" />
            <span className="font-space text-[10px] tracking-[0.6em] text-yellow-500/60 uppercase font-bold">IDENTITY_SYSTEM</span>
          </div>
          <h2 className="font-space text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-[0_8px_15px_rgba(0,0,0,1)]">
            BRAND<br /><span className="text-yellow-500">IDENTITY</span>
          </h2>
        </div>
      </motion.div>

      {/* ── INTERACTIVE AREA ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 w-full max-w-[1500px] mx-auto px-12 mt-24">
        
        {/* Artifact Selection - Left Side */}
        <motion.div 
          layout 
          onClick={(e) => e.stopPropagation()}
          className={`relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center flex-shrink-0 transition-all duration-700 ease-in-out ${selectedId ? 'lg:-ml-[150px] scale-75' : 'lg:-ml-0'}`}
        >
          {/* ── CENTRAL ANCHOR (No Image) ────────────────────────────── */}
          <div className="absolute z-20 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full" />
          </div>

          {/* ── SKILL ROCKS (FLY OUT) ────────────────────────────────── */}
          {SKILL_GROUPS.map((group, i) => {
            const isSelected = selectedId === group.id;
            const isFaded = selectedId !== null && !isSelected;
            
            // Staggered reveal logic: each rock takes 0.4 of the total 1.0 progress
            // Rock 0: 0.0 -> 0.4
            // Rock 1: 0.2 -> 0.6
            // Rock 2: 0.4 -> 0.8
            // Rock 3: 0.6 -> 1.0
            const start = i * 0.2;
            const end = start + 0.4;
            const rockProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
            
            const isFinalized = rockProgress >= 1;
            const pos = getDiamondPos(i);

            return (
              <motion.div
                layout
                key={group.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFinalized) setSelectedId(isSelected ? null : group.id);
                }}
                animate={{
                  x: rockProgress * pos.x,
                  y: rockProgress * pos.y,
                  scale: isSelected ? 1.4 : (isFaded ? 0.6 : rockProgress),
                  opacity: isFaded ? 0.3 : rockProgress,
                  zIndex: isSelected ? 30 : 10
                }}
                whileHover={{ scale: isFinalized && !isSelected ? 1.15 : (isSelected ? 1.4 : rockProgress) }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                }}
                className={`absolute w-[100px] h-[100px] md:w-[160px] md:h-[160px] ${isFinalized ? 'cursor-pointer' : 'pointer-events-none'}`}
              >
                {/* Floating Animation Wrapper */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  <div 
                    className="absolute inset-0 rounded-full blur-[50px] opacity-30"
                    style={{ backgroundColor: group.color }}
                  />
                  <img 
                    src={group.image} 
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,1)]" 
                    alt={group.title} 
                  />

                  {/* ── ROCK LABEL ────────────────────────────────────── */}
                  <motion.div
                    animate={{ 
                      opacity: rockProgress > 0.8 ? (isSelected ? 0 : 1) : 0,
                      y: i === 0 ? -60 : (i === 3 ? 60 : 0),
                      x: i === 1 ? -100 : (i === 2 ? 100 : 0)
                    }}
                    className="absolute pointer-events-none whitespace-nowrap"
                  >
                    <span 
                      className="font-space text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                      style={{ color: group.color }}
                    >
                      {group.title}
                    </span>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent mt-1" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* The Laboratory Info Card - Right Side */}
        <AnimatePresence mode="wait">
          {selectedGroup && (
            <motion.div
              key={selectedGroup.id}
              initial={{ opacity: 0, scale: 0.9, x: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: 50, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#4a362d] border-[4px] border-[#2a1d17] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                
                {/* Golden Header Bar */}
                <div className="bg-gradient-to-b from-[#f8d448] to-[#c28e18] p-3 border-b-[4px] border-[#2a1d17] flex justify-between items-center px-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-space text-2xl md:text-4xl font-black text-[#2a1d17] uppercase tracking-tighter">
                      {selectedGroup.title}
                    </h3>
                  </div>
                  <div className="bg-[#2a1d17] text-yellow-500 px-3 py-1 rounded-full font-space text-[10px] font-black border border-yellow-500/30">
                    MASTERED
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                  
                  {/* PRIMARY HIGHLIGHT: Elite Units (The Skills) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <span className="font-space text-[10px] text-yellow-500 font-black tracking-[0.4em] uppercase">Deployed_Elite_Units</span>
                       <div className="h-px flex-grow bg-yellow-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedGroup.skills.map((skill, i) => (
                        <HoverXPItem key={i}>
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#2a1d17] p-4 border-2 border-[#f8d448]/40 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:border-[#f8d448] transition-all group relative overflow-hidden h-full"
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col gap-1 relative z-10">
                               <div className="flex justify-between items-center">
                                  <span className="font-space text-sm md:text-lg font-black text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tighter">
                                    {skill}
                                  </span>
                                  <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                               </div>
                               <div className="font-space text-[8px] text-yellow-500/50 font-bold uppercase tracking-widest">MASTERED</div>
                            </div>
                          </motion.div>
                        </HoverXPItem>
                      ))}
                    </div>
                  </div>

                  {/* SECONDARY: Tactical Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-5 rounded-xl border border-[#2a1d17]">
                    {selectedGroup.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                          <span className="font-space text-[9px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                          <span className="font-space text-[10px] font-black text-yellow-500/80 tracking-widest">{stat.val}</span>
                        </div>
                        {stat.stars && (
                          <div className="flex items-center justify-between px-1">
                             <StarRating count={stat.stars} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* TERTIARY: Research Log (Compact) */}
                  <div className="relative group">
                    <div className="absolute -top-2 left-4 bg-[#2a1d17] px-2 py-0.5 font-space text-[7px] font-black text-white/30 uppercase tracking-[0.3em] z-10">
                      RESEARCH_LOG
                    </div>
                    <div className="bg-[#38261e] p-4 rounded-lg border border-[#2a1d17] opacity-60 group-hover:opacity-100 transition-opacity">
                      <p className="font-serif text-sm md:text-base italic text-white/80 leading-relaxed">
                        "{selectedGroup.description}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Heavy Bottom Accent */}
                <div className="h-2 bg-[#2a1d17] w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'EB Garamond', serif; }
      `}</style>
    </section>
  );
};

export default SkillVault;
