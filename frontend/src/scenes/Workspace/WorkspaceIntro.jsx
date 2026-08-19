import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WorkspaceScene from "./WorkspaceScene";

function BlackOverlay({ progress }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 bg-black"
      style={{ opacity: useTransform(progress, [0, 0.5], [1, 0]) }}
    />
  );
}

function ScrollController({ progress }) {
  const opacity = useTransform(progress, [0.8, 1], [1, 0]);
  const scale = useTransform(progress, [0.8, 1], [1, 0.95]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity, scale }}
    >
      <div className="flex h-full items-end justify-center pb-24">
        <motion.div
          className="flex flex-col items-center gap-2"
          style={{ opacity: useTransform(progress, [0, 0.15], [0, 1]) }}
        >
          <span className="text-xs tracking-[0.3em] text-white/40 uppercase">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function UILayer({ progress }) {
  const y = useTransform(progress, [0, 0.4], [60, 0]);
  const opacity = useTransform(progress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ y, opacity }}
    >
      <h1 className="text-6xl font-bold tracking-tight text-white md:text-8xl">
        Workspace
      </h1>
    </motion.div>
  );
}

export default function WorkspaceIntro() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <WorkspaceScene className="absolute inset-0" />
        <BlackOverlay progress={scrollYProgress} />
        <ScrollController progress={scrollYProgress} />
        <UILayer progress={scrollYProgress} />
      </div>
    </div>
  );
}
