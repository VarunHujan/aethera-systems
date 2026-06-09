import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ForgeLoader = ({ imagesReady, onFinished }) => {
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // Minimum 2.5 seconds animation
    const intervalTime = 25; 
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      let newProgress = Math.floor((currentStep / totalSteps) * 100);
      
      if (newProgress >= 99) {
        if (imagesReady) {
           setVisualProgress(100);
           clearInterval(timer);
           // Short pause at 100% to let the user see it finished
           setTimeout(() => {
             onFinished();
           }, 500);
        } else {
           // Hold at 99% until the images are actually done downloading
           setVisualProgress(99);
        }
      } else {
        setVisualProgress(newProgress);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [imagesReady, onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808]"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Anvil / Base */}
        <div className="absolute bottom-6 w-24 h-10 bg-gradient-to-t from-zinc-800 to-zinc-600 rounded-t-xl border-t-4 border-zinc-400 shadow-[0_0_30px_rgba(248,212,72,0.15)] flex justify-center">
           <div className="absolute top-0 w-3/4 h-1 bg-yellow-500/40 blur-[2px]" />
           {/* Anvil horn */}
           <div className="absolute -left-4 top-0 w-6 h-4 bg-zinc-600 rounded-l-full border-t-2 border-zinc-400" />
           <div className="absolute -right-4 top-0 w-6 h-6 bg-zinc-600 rounded-r-md border-t-2 border-zinc-400" />
        </div>
        
        {/* Hammer - Animates continuously */}
        <motion.div
          animate={{ 
            rotate: [0, -60, 5, 0],
            y: [0, -30, 5, 0],
            x: [0, 20, -5, 0]
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originX: 0.8, originY: 0.8 }}
          className="absolute bottom-16 right-12 w-20 h-20 flex items-end justify-end"
        >
          <svg viewBox="0 0 24 24" className="w-16 h-16 text-zinc-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] fill-current">
            <path d="M21.71 3.29a1 1 0 0 0-1.42 0l-1.41 1.41-5.66-5.65a1 1 0 0 0-1.41 0L9.69 1.17a1 1 0 0 0 0 1.42l5.65 5.65-1.41 1.41a1 1 0 0 0 0 1.42l1.41 1.41-9.9 9.9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9.9-9.9 1.41 1.41a1 1 0 0 0 1.42 0l1.41-1.41 5.65 5.66a1 1 0 0 0 1.42 0l2.12-2.12a1 1 0 0 0 0-1.42l-5.65-5.65 1.41-1.42a1 1 0 0 0 0-1.41l-4.24-4.25z"/>
          </svg>
        </motion.div>

        {/* Sparks */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          className="absolute bottom-14 w-10 h-10 rounded-full bg-yellow-500/80 blur-xl"
        />
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.5], x: [0, -30, -50], y: [0, -20, 10] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          className="absolute bottom-16 left-20 w-2 h-2 rounded-full bg-yellow-300 blur-[2px]"
        />
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.5], x: [0, 30, 50], y: [0, -30, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          className="absolute bottom-16 right-20 w-1.5 h-1.5 rounded-full bg-yellow-100 blur-[1px]"
        />
      </div>

      {/* Progress Text */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <span className="font-space text-white text-5xl font-black tracking-tighter flex items-end drop-shadow-[0_0_20px_rgba(248,212,72,0.4)]">
          {visualProgress}<span className="text-yellow-500/80 text-2xl mb-1 ml-1">%</span>
        </span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-yellow-500/60" />
          <span className="font-space text-[10px] text-yellow-500 tracking-[0.6em] uppercase font-bold">
            Forging Architecture
          </span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-yellow-500/60" />
        </div>
      </div>

      {/* Loading Bar */}
      <div className="w-64 h-1.5 bg-white/5 rounded-full mt-8 overflow-hidden relative">
         <motion.div 
           className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-200"
           animate={{ width: `${visualProgress}%` }}
           transition={{ duration: 0.1, ease: "linear" }}
         >
           <div className="absolute right-0 top-0 w-4 h-full bg-white blur-[2px]" />
         </motion.div>
      </div>

    </motion.div>
  );
};

export default ForgeLoader;
