"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = "", speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const updateOffset = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setOffset(rect.top);
      }
    };
    updateOffset();
    window.addEventListener("scroll", updateOffset);
    return () => window.removeEventListener("scroll", updateOffset);
  }, []);

  const y = useTransform(
    useScroll().scrollY,
    [0, 2000],
    [0, 200 * speed]
  );

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
