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

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          video.play().catch(() => {});
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
