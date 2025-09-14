"use client";

import { useState, useEffect } from "react";

// Custom hook for scroll position
function useScrollY(): number {
  const [scrollY, setScrollY] = useState<number>(window.scrollY);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

// Custom hook for window width
function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

// Helper function for opacity
function getOpacity(scrollY: number): number {
  return Math.min(1, scrollY / 300);
}

// Helper function for box size
function getBoxSize(windowWidth: number): number {
  return windowWidth > 768 ? 200 : 100;
}

export default function ReactiveComponent() {
  const scrollY = useScrollY();
  const windowWidth = useWindowWidth();

  const opacity = getOpacity(scrollY);
  const boxSize = getBoxSize(windowWidth);

  return (
    <div className="h-[200vh] flex flex-col items-center justify-center">
      <div
        style={{
          width: boxSize,
          height: boxSize,
          backgroundColor: "skyblue",
          opacity: opacity,
          transition: "width 0.3s, height 0.3s, opacity 0.2s",
        }}
      />
      <p className="mt-4">
        Scroll Y: {scrollY}px | Window Width: {windowWidth}px
      </p>
    </div>
  );
}
