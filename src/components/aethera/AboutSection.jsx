import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHubStore } from '../../store/useHubStore';

const HEROES = [
  {
    id: 'bk',
    heroTitle: "IMMERSIVE LORE",
    color: "#00d4ff", 
    image: "/assets/characters/barbarian_king.png",
    characterName: "THE LOREMASTER",
    point: "We don't just build pages; we architect worlds. Every campaign is rooted in a deep, interactive narrative that transforms passive scrolling into an active quest."
  },
  {
    id: 'aq',
    heroTitle: "TACTICAL UI",
    color: "#d147ff", 
    image: "/assets/characters/archer_queen.png",
    characterName: "THE ARCHITECT",
    point: "Precision-guided interfaces that strike with surgical accuracy. We craft lethal UI/UX experiences that capture absolute market attention through intentional asymmetry."
  },
  {
    id: 'gw',
    heroTitle: "SCALABLE ENGINES",
    color: "#ffae00", 
    image: "/assets/characters/grand_warden.png",
    characterName: "THE STRATEGIST",
    point: "Providing an aura of limitless scalability. We optimize underlying WebGL and React architectures to ensure your digital kingdom performs flawlessly under massive traffic."
  },
  {
    id: 'rc',
    heroTitle: "PLAYER RETENTION",
    color: "#ff4d4d", 
    image: "/assets/characters/royal_champion.png",
    characterName: "THE INNOVATOR",
    point: "Relentlessly targeting engagement loops. By integrating game mechanics into web flow, we ensure your audience doesn't just visit—they return to conquer."
  }
];

const AboutSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimatingState, setIsAnimatingState] = useState(false);
  const isAnimatingRef = useRef(false);
  const indexRef = useRef(0);
  
  const scrollAccumulator = useRef(0);
  const mountTime = useRef(Date.now());
  const sectionRef = useRef(null);
  const { lenis } = useHubStore();
  const isHeroComplete = useHubStore(s => s.isHeroComplete);
  const hero = HEROES[index];

  useEffect(() => {
    if (isHeroComplete) {
      mountTime.current = Date.now();
      setIndex(0);
      indexRef.current = 0;
      scrollAccumulator.current = 0;
    }
  }, [isHeroComplete]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current || !lenis) return;
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
      const isAtFirstHero = indexRef.current === 0;
      const isAtLastHero = indexRef.current === HEROES.length - 1;
      const shouldRelease = (isAtFirstHero && isScrollingUp) || (isAtLastHero && isScrollingDown);

      if (!shouldRelease) {
        lenis.stop();
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        scrollAccumulator.current += e.deltaY;
        if (Math.abs(scrollAccumulator.current) > 120) {
          if (!isAnimatingRef.current) {
            if (isScrollingDown && !isAtLastHero) {
              setDirection(1);
              changeHero(indexRef.current + 1);
            } else if (isScrollingUp && !isAtFirstHero) {
              setDirection(-1);
              changeHero(indexRef.current - 1);
            }
          }
          scrollAccumulator.current = 0;
        }
      } else {
        lenis.start();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => { window.removeEventListener('wheel', handleWheel); };
  }, [lenis]);

  const changeHero = (newIndex) => {
    isAnimatingRef.current = true;
    setIsAnimatingState(true);
    setIndex(newIndex);
    indexRef.current = newIndex;
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimatingState(false);
    }, 800);
  };

  const textVariants = {
    initial: (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50, filter: 'blur(10px)' }),
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50, filter: 'blur(10px)' })
  };

  const cardVariants = {
    initial: (dir) => ({ opacity: 0, x: dir > 0 ? 200 : -200, rotateY: dir > 0 ? 45 : -45, scale: 0.8 }),
    animate: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -300 : 300, rotateY: dir > 0 ? -45 : 45, scale: 0.8 })
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full h-screen relative bg-[#0a0806] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#080808] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#080808] to-transparent z-20 pointer-events-none" />

      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/map.png" 
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.2] grayscale-[0.4]" 
          alt="Map" 
        />
        <motion.div 
          animate={{ background: `radial-gradient(circle at center, ${hero.color}11 0%, transparent 70%)` }}
          className="absolute inset-0 transition-colors duration-1000"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 items-center px-12 md:px-24 gap-12 lg:gap-24">
        
        <div className="flex flex-col justify-center gap-8 lg:pr-12 lg:items-end text-center lg:text-right">
          <div className="flex flex-col gap-2 items-center lg:items-end">
            <motion.h2 
              animate={{ color: hero.color }}
              className="font-space text-3xl md:text-5xl font-black tracking-tight uppercase transition-colors duration-700"
            >
              AGENCY PHILOSOPHY
            </motion.h2>
            <motion.div 
              animate={{ backgroundColor: hero.color }}
              className="w-24 h-1.5 shadow-[0_0_20px_currentColor]" 
            />
          </div>

          <div className="relative min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-5 items-center lg:items-end"
              >
                <div className="flex items-center gap-3">
                   <div className="h-px w-8 bg-white/20" />
                   <span className="font-space text-[10px] text-white/40 font-black tracking-[0.5em] uppercase">Deployment_Strategy</span>
                </div>
                <motion.h3 
                  animate={{ color: hero.color }}
                  className="font-space text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-tight transition-colors duration-700"
                  style={{ textShadow: `2px 2px 0px rgba(0,0,0,0.8), 0 0 40px ${hero.color}22` }}
                >
                  {hero.heroTitle}
                </motion.h3>
                
                <p className="font-serif text-xl md:text-2xl leading-relaxed italic text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] max-w-xl">
                  "{hero.point}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 lg:justify-end">
             {HEROES.map((h, i) => (
               <motion.div 
                 key={`hud-${h.id}`}
                 animate={{ 
                   width: i === index ? 60 : 12,
                   backgroundColor: i === index ? hero.color : 'rgba(255,255,255,0.1)'
                 }}
                 className="h-1.5 rounded-full transition-all duration-500 shadow-inner"
               />
             ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center perspective-[2000px]">
          <div className="relative w-[300px] h-[420px] md:w-[350px] md:h-[500px]">
             <AnimatePresence mode="popLayout" custom={direction}>
               <motion.div
                  key={hero.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 preserve-3d shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
               >
                  {/* CLASH HERO PLATE */}
                  <div className="w-full h-full bg-[#4a362d] rounded-[24px] overflow-hidden flex flex-col border-[4px] border-[#2a1d17]">
                     <div className="relative flex-grow w-full overflow-hidden bg-black">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#000]" />
                        <motion.img 
                          src={hero.image} 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="w-full h-full object-cover object-top scale-[1.3] origin-top translate-y-[5%] brightness-[1.1] contrast-[1.1]" 
                          alt="" 
                        />
                     </div>
                     
                     {/* Signature Nameplate: Stone/Gold */}
                     <div className="h-16 md:h-20 w-full bg-gradient-to-b from-[#f8d448] to-[#c28e18] flex flex-col items-center justify-center border-t-[4px] border-[#2a1d17]">
                        <span className="font-space font-black text-[#2a1d17] text-lg md:text-xl tracking-[0.1em] uppercase leading-none">
                          AETHERA AGENCY
                        </span>
                        <span className="font-space font-bold text-[#2a1d17]/60 text-[8px] md:text-[10px] tracking-[0.4em] uppercase">
                          {hero.characterName}
                        </span>
                     </div>
                  </div>
               </motion.div>
             </AnimatePresence>
          </div>
          
          <div className="absolute -bottom-24 flex flex-col items-center gap-3 opacity-30">
             <span className="text-[10px] font-space font-bold tracking-[0.5em] text-white uppercase animate-pulse">
               {index === HEROES.length - 1 ? "System Stabilized" : "Initiate Next Phase"}
             </span>
             <motion.div 
               animate={{ y: [0, 15, 0] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-px h-12 bg-gradient-to-b from-white to-transparent" 
             />
          </div>
        </div>
      </div>

      <style>{`
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'EB Garamond', serif; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
};

export default AboutSection;
