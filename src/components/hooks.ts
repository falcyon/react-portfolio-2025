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


//works everywhere but on iphone without flicking. 
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

      const delta = (targetY - currentY) * 0.01+1;
      const step = Math.sign(delta) * Math.min(Math.abs(delta), 6);
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

//works on iphone while flicking. 
export function useScrollYwithAutoScrolliphonefix(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let animationFrame: number | null = null;
    let scrollTimeout: number | null = null;

    const targetY = 595;

    const smoothScroll = () => {
      const currentY = window.scrollY;

      if (currentY >= targetY) {
        animationFrame = null;
        return;
      }

      const delta = (targetY - currentY) * 0.1; // smoother attraction
      const nextY = currentY + Math.sign(delta) * Math.min(Math.abs(delta), 12);

      window.scrollTo(0, nextY);
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    const triggerAutoScroll = () => {
      if (!animationFrame && window.scrollY < targetY) {
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Cancel any pending scroll detection
      if (scrollTimeout) window.clearTimeout(scrollTimeout);

      // Wait until momentum scroll finishes (≈100ms silence)
      scrollTimeout = window.setTimeout(() => {
        triggerAutoScroll();
      }, 120);
    };

    setScrollY(window.scrollY); // init
    window.addEventListener("scroll", handleScroll);
window.addEventListener("load", triggerAutoScroll);

    // ✅ Trigger immediately if already loaded
    if (document.readyState === "complete") {
      triggerAutoScroll();
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", triggerAutoScroll);
     
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return scrollY;
}

