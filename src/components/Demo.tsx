"use client";
import { useState, useEffect } from "react";

export default function ReactiveComponent() {
  // State that updates on scroll
  const [scrollY, setScrollY] = useState(0); //the value in useState is only used on first render. After that, it's all from setScrollY

  // State that updates on window resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // the value in useState is only used on first render

  // Example derived values
  const opacity = Math.min(1, scrollY / 300); //
  const boxSize = windowWidth > 768 ? 200 : 100; // responsive size

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); //this creates the event listener only once when the component mounts. Every time the user scrolls, handleScroll is called, updating scrollY state. The entire component re-renders on every scroll, but the event listener is not recreated. boxsize is also recalculated when user scrolls, but it only changes when windowWidth changes.

  // Resize effect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
