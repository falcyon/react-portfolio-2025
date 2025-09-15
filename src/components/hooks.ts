import { useState, useEffect } from "react";

// Custom hook for scroll position with autoscroll
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    setScrollY(window.scrollY); // initialize on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}



export function useScrollYwithAutoScroll(): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    setScrollY(window.scrollY); // initialize on mount
    window.addEventListener("scroll", handleScroll);

    const targetY = 595;
    let animationFrame: number | null = null;

    const smoothScroll = () => {
      const currentY = window.scrollY;

      // ✅ Only animate if we're below the target
      if (currentY >= targetY) {
        animationFrame = null;
        return;
      }

      const delta = (targetY - currentY) * 0.02+1;
      const step = Math.sign(delta) * Math.min(Math.abs(delta), 9);
      const nextY = currentY + step;

      window.scrollTo(0, nextY);

      // Continue animating if we haven’t reached targetY
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    const triggerAutoScroll = () => {
      const currentY = window.scrollY;

      // Only start animation if scroll is below target
      if (!animationFrame && currentY < targetY) {
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    };

    // Run immediately if already loaded
    if (document.readyState === "complete") {
      triggerAutoScroll();
    } else {
      window.addEventListener("load", triggerAutoScroll);
    }

    // Re-run if user scrolls back under targetY
    window.addEventListener("scroll", triggerAutoScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", triggerAutoScroll);
      window.removeEventListener("load", triggerAutoScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return scrollY;
}