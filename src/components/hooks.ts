import { useEffect } from "react";

// Hook to play/pause video based on visibility
export function useVideoVisibility(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
): void {
  useEffect(() => {
    if (!isActive) return;
    const video = videoRef.current;
    if (!video) return;

    let isVisible = false;

    const tryPlay = () => {
      video.play().catch(() => {
        // Video not ready yet — retry once it can play
        video.addEventListener("canplay", () => {
          if (isVisible) video.play().catch(() => {});
        }, { once: true });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef, isActive]);
}
