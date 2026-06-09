import React from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

const ContactSection = () => {
  // Advanced Staggering Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
        delayChildren: 0.1,   // Initial delay before staggering starts
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="w-full min-h-screen relative bg-[#080808] flex flex-col justify-between overflow-hidden">
      {/* ── BACKGROUND ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/assets/clash-wallpaper.jpg" 
          className="w-full h-full object-cover brightness-[0.6] contrast-[1.3] scale-[1.1]" 
          alt="Connect Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-transparent" />
        {/* Ambient Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-8 md:px-24 flex-grow flex flex-col justify-center gap-12 py-24">
        
        {/* Animated Container wraps the content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-start gap-8"
        >
          {/* ── HEADER ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-16 h-px bg-yellow-500/60" />
            <span className="font-space text-[10px] tracking-[0.8em] text-yellow-500 font-black uppercase drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] animate-pulse">
              ESTABLISH_UPLINK // 2026
            </span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <h2 className="font-space text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex flex-col">
              <motion.span variants={itemVariants}>INITIATE</motion.span>
              <motion.span variants={itemVariants} className="text-yellow-500">PARTNERSHIP</motion.span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-6 mt-4">
             <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0">
               <Swords className="w-6 h-6 text-yellow-500" />
             </div>
             <p className="font-serif text-xl md:text-2xl italic text-white/40 max-w-xl leading-relaxed">
               "The frontier of digital architecture is waiting. Every great ecosystem starts with a single connection. Deploy your vision to the Aethera network."
             </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── STANDARD FOOTER ────────────────────────────────────────── */}
      <footer className="relative z-10 w-full bg-[#050505] border-t border-white/5 py-10 px-8 md:px-24 flex flex-col md:flex-row items-center justify-between gap-6 mt-auto">
         <div className="flex flex-col items-center md:items-start gap-2">
           <span className="font-space text-lg font-black text-white tracking-tight uppercase">Aethera Systems</span>
           <span className="font-space text-xs text-white/40 tracking-widest uppercase">
             © {new Date().getFullYear()} All rights reserved.
           </span>
         </div>

         <div className="flex items-center gap-6">
           <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="font-space text-xs font-bold text-white/40 hover:text-yellow-500 transition-colors tracking-widest uppercase cursor-pointer"
           >
             Back to Top
           </button>
         </div>
      </footer>

      <style>{`
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'EB Garamond', serif; }
      `}</style>
    </section>
  );
};

export default ContactSection;
