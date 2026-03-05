"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Zap, ArrowRight, Sparkles } from "@/components/icons";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Hero() {
  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-950 text-neutral-50 pt-20 pb-32">
      {/* Background Gradients/Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[128px]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-neutral-800 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
            Nano Banana 2.0 Engine Live
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-500"
        >
          Design the Future with <br />
          <span className="text-amber-500">Intelligent Speed</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Create stunning architectural, fashion, and interior designs in seconds.
          Powered by our most advanced AI model yet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-4 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-lg hover:bg-amber-400 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.5)] active:scale-95">
            <span className="flex items-center gap-2">
              Start Creating <Zap className="w-5 h-5 fill-current" />
            </span>
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          </button>

          <button className="px-8 py-4 rounded-xl bg-neutral-900 text-neutral-300 font-medium text-lg hover:bg-neutral-800 transition-all border border-neutral-800 hover:border-neutral-700 flex items-center gap-2 group">
            <Layers className="w-5 h-5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            View Gallery
          </button>
        </motion.div>

        {/* Floating Glass Cards (Decorative) */}
        <div className="hidden md:block absolute top-1/2 -left-12 -translate-y-1/2 w-64 p-4 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="h-2 w-20 bg-neutral-800 rounded-full mb-1" />
              <div className="h-1.5 w-12 bg-neutral-800/60 rounded-full" />
            </div>
          </div>
          <div className="h-32 rounded-lg bg-neutral-800/30 w-full animate-pulse" />
        </div>

        <div className="hidden md:block absolute top-1/2 -right-12 -translate-y-1/2 w-64 p-4 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="h-2 w-20 bg-neutral-800 rounded-full mb-1" />
              <div className="h-1.5 w-12 bg-neutral-800/60 rounded-full" />
            </div>
          </div>
          <div className="h-32 rounded-lg bg-neutral-800/30 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
