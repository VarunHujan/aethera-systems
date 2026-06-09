import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState([]);
  
  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Spring config for a "snappy but fluid" game feel
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHoverStart = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleClick = (e) => {
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks(prev => prev.filter(click => click.id !== id));
      }, 600);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <>
      {/* ── Click Ripples (Deploy Effect) ── */}
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-12 h-12 border-2 border-yellow-500 rounded-full pointer-events-none z-[10000]"
            style={{ 
              x: click.x, 
              y: click.y, 
              translateX: '-50%', 
              translateY: '-50%',
              boxShadow: '0 0 20px rgba(234,179,8,0.4)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* ── Outer Reticle ── */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-yellow-500/20 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovered ? 1.4 : 1,
        }}
      >
        {/* Reticle Corner Brackets (Tactical Style) */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-500" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-500" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-500" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-500" />
        
        {/* Inner Scanning Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-dashed border-yellow-500/10 rounded-full"
        />

        {/* Pulsing inner ring when hovering */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 border-2 border-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              transition={{ repeat: Infinity, duration: 1, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Central "Tap" Point ── */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] shadow-[0_0_12px_rgba(255,255,255,1)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovered ? 0.8 : 1,
        }}
      >
        {/* Core Glow */}
        <div className="absolute inset-0 bg-yellow-400 blur-[2px] rounded-full scale-150 opacity-60" />
      </motion.div>

      {/* ── Ambient Environment Glow ── */}
      <motion.div
        className="fixed top-0 left-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none z-[9998]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default CustomCursor;
