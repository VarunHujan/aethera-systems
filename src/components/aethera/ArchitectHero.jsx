import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import ForgeLoader from './ForgeLoader';

const ArchitectHero = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  
  // Mouse Tracking for Scouting Drone
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Center the coordinates (0,0 is center of screen)
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x * 0.15); // Add slight dampening to range
      mouseY.set(y * 0.15);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Two-part loading state
  const [imagesReady, setImagesReady] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);

  const TOTAL_FRAMES = 192;
  const GATE_OPEN_FRAME = 130; 
  
  const currentFrame = useRef(0);
  const virtualScroll = useRef(0);
  const targetVirtualScroll = useRef(0);
  const [frameIndexState, setFrameIndexState] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const isSequenceReady = imagesReady && loaderFinished;

  // 1. PRELOAD ALL IMAGES
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;
    const preloadImages = () => {
      // Start from 1 and load all 192 frames into memory
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/assets/hero-frames/frames_webp/frame_${i.toString().padStart(4, '0')}.webp`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) setImagesReady(true);
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };
    preloadImages();
  }, []);

  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = images[index];
    if (!img || !img.complete) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const dpr = window.devicePixelRatio || 1;
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (canvasAspect > imgAspect) {
      drawWidth = canvas.width / dpr;
      drawHeight = (canvas.width / imgAspect) / dpr;
      offsetX = 0;
      offsetY = (canvas.height / dpr - drawHeight) / 2;
    } else {
      drawWidth = (canvas.height * imgAspect) / dpr;
      drawHeight = canvas.height / dpr;
      offsetX = (canvas.width / dpr - drawWidth) / 2;
      offsetY = 0;
    }
    context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        const context = canvasRef.current.getContext('2d');
        if (context) context.scale(dpr, dpr);
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
        renderFrame(currentFrame.current);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, isSequenceReady]);

  // SCROLL LOGIC
  useEffect(() => {
    if (!isSequenceReady) return;

    const handleWheel = (e) => {
      if (window.scrollY === 0) {
        const delta = e.deltaY * 0.0005;
        const newTarget = Math.max(0, Math.min(1, targetVirtualScroll.current + delta));
        
        if (newTarget !== targetVirtualScroll.current) {
          targetVirtualScroll.current = newTarget;
          
          if (targetVirtualScroll.current >= 0.99) {
            if (!isDone) {
              setIsDone(true);
              if (onComplete) onComplete(true);
            }
          } 
          else if (targetVirtualScroll.current < 0.99) {
            if (isDone) {
              setIsDone(false);
              if (onComplete) onComplete(false);
            }
          }
        }
      }
    };

    let raf;
    const tick = () => {
      virtualScroll.current += (targetVirtualScroll.current - virtualScroll.current) * 0.1;
      
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1, 
        Math.floor(virtualScroll.current * TOTAL_FRAMES)
      );

      if (currentFrame.current !== frameIndex) {
        currentFrame.current = frameIndex;
        renderFrame(frameIndex);
        setFrameIndexState(frameIndex);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(raf);
    };
  }, [isSequenceReady, images, isDone, onComplete]);

  // VISUAL LOGIC: Name & Title during Interactive Scroll
  const progressAfterGate = Math.max(0, (frameIndexState - GATE_OPEN_FRAME) / (TOTAL_FRAMES - GATE_OPEN_FRAME));
  const nameOpacity = progressAfterGate > 0 ? Math.min(1, progressAfterGate * 4) : 0;
  const nameScale = 0.8 + (progressAfterGate * 0.4); 
  const nameY = 50 - (progressAfterGate * 50);
  const nameBlur = `blur(${Math.max(0, 20 - (progressAfterGate * 40))}px)`;

  return (
    <div 
      className="w-full h-screen bg-[#080808] fixed inset-0 z-0"
      style={{ 
        pointerEvents: isDone ? 'none' : 'auto',
        visibility: isDone ? 'visible' : 'visible'
      }}
    >
      <AnimatePresence>
        {!isSequenceReady && (
          <ForgeLoader 
            imagesReady={imagesReady} 
            onFinished={() => setLoaderFinished(true)} 
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* INTRO MESSAGES: Welcome & Scroll Down */}
      <AnimatePresence>
        {isSequenceReady && frameIndexState < 5 && (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-space text-4xl md:text-6xl font-black text-white tracking-[0.5em] md:tracking-[0.8em] uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] text-center"
            >
              WELCOME TO
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1, ease: 'easeOut' }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <span className="font-space text-yellow-500 text-xs tracking-[0.5em] uppercase font-bold animate-pulse">
                SCROLL DOWN TO INITIATE
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-yellow-500 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TACTICAL ENVIRONMENTAL HUD */}
      <AnimatePresence>
        {frameIndexState > 15 && frameIndexState < 125 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          >
            {/* SIMPLE MINIMALIST COORDINATES */}
            <div className="absolute top-10 left-10 flex flex-col gap-1 font-mono text-[10px] text-yellow-500/80 tracking-[0.2em] z-30 select-none">
              <div className="flex items-center gap-2">
                <span className="opacity-40">LAT:</span>
                <span>{(27.9881 + (frameIndexState * 0.0012)).toFixed(4)}° N</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-40">LON:</span>
                <span>{(86.9250 - (frameIndexState * 0.0008)).toFixed(4)}° E</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                <span className="text-white/40 uppercase tracking-[0.3em] text-[8px]">Scouting_Active</span>
              </div>
            </div>

            {/* TOPOGRAPHIC SCANNING GRID (Interactive Environment) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '80px 80px',
                  maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                  transform: `perspective(1000px) rotateX(65deg) translateY(${frameIndexState * 4}px)`,
                }}
              />
            </div>

            {/* CENTRAL PILOT RETICLE (Scouting Drone) */}
            <motion.div 
              style={{ x: smoothMouseX, y: smoothMouseY }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <div className="relative w-64 h-64 border border-white/5 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                {/* Local Scan Data Block */}
                <div className="absolute -right-40 top-0 flex flex-col gap-1 font-mono text-[8px] text-yellow-500/60 tracking-[0.2em] uppercase select-none">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,1)]" />
                      <span className="font-black">Local_Scan</span>
                   </div>
                   <div className="flex flex-col border-l border-white/10 pl-3 gap-0.5">
                      <span className="opacity-40 text-[6px]">Status: Locked</span>
                      <span className="opacity-40 text-[6px]">Signal: Strong</span>
                      <div className="mt-1 h-[2px] w-12 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           animate={{ x: ['-100%', '100%'] }}
                           transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                           className="h-full w-1/2 bg-yellow-500/40"
                         />
                      </div>
                   </div>
                </div>

                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,1)]" />
                
                {/* Crosshairs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-yellow-500/40" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-yellow-500/40" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-px bg-yellow-500/40" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-px bg-yellow-500/40" />
                
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/20 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/20 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/20 rounded-br-xl" />
                
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-8 border border-white/10 rounded-full"
                />
              </div>
            </motion.div>

            {/* SCANNING BEAM */}
            <motion.div 
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 h-1/3 w-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE TEXT: AETHERA SYSTEMS */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        style={{ 
          opacity: nameOpacity,
          transform: `scale(${nameScale}) translateY(${nameY}px)`,
          filter: nameBlur,
          transition: 'none'
        }}
      >
        <div className="flex flex-col items-center px-6">
          <h1 
            className="text-editorial gradient-silver text-center select-none"
            style={{ 
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              lineHeight: '0.85',
              letterSpacing: '-0.04em',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
            }}
          >
            AETHERA<br />SYSTEMS
          </h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progressAfterGate > 0.5 ? 1 : 0, y: progressAfterGate > 0.5 ? 0 : 20 }}
            className="mt-4 md:mt-8 flex flex-col items-center"
          >
            <span className="font-space text-yellow-500 text-3xl md:text-5xl font-black tracking-[0.3em] uppercase italic mb-12">
              CAMPAIGNS
            </span>

            {/* Scroll for more hint at the very end */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: progressAfterGate > 0.9 ? 1 : 0 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="font-space text-white/40 text-[10px] tracking-[0.6em] uppercase">Scroll down for more</span>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-16 bg-gradient-to-b from-yellow-500 to-transparent"
              />
            </motion.div>
          </motion.div>
          
          <div className="mt-12 flex flex-col items-center w-full max-sm:px-4">
             <div className="flex items-center gap-4 w-full opacity-60">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white/30" />
              <span className="font-space text-white text-[10px] md:text-[11px] tracking-[0.5em] md:tracking-[0.8em] uppercase font-light whitespace-nowrap">
                GAMIFIED WEB EXPERIENCES
              </span>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isSequenceReady ? 0.1 : 0 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-px h-12 bg-white" />
        <span className="font-mono text-white text-[7px] tracking-[1em] uppercase">Cinematic Sequence</span>
      </motion.div>

      <style>{`
        @keyframes fluid-light {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ArchitectHero;
