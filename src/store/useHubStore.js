import { create } from 'zustand';

export const useHubStore = create((set) => ({
  // ── Phases ─────────────────────────────────────────────────
  // intro, hub, detail
  phase: 'intro', 
  setPhase: (phase) => set({ phase }),

  // ── Navigation ──────────────────────────────────────────────
  activeDistrict: null, // 'archive', 'forge', 'skyreach', 'void'
  hoveredDistrict: null,
  lenis: null,
  isHeroComplete: false,
  
  setActiveDistrict: (id) => set({ activeDistrict: id }),
  setHoveredDistrict: (id) => set({ hoveredDistrict: id }),
  setLenis: (lenis) => set({ lenis }),
  setIsHeroComplete: (status) => set({ isHeroComplete: status }),

  // ── Narrative ───────────────────────────────────────────────
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));
