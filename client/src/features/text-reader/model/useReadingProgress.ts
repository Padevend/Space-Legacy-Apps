import { useState, useEffect, RefObject } from 'react';

export function useReadingProgress(targetRef: RefObject<HTMLElement>, totalMinutes = 3) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(totalMinutes);

  useEffect(() => {
    const handleScroll = () => {
      const element = targetRef.current;
      if (!element) return;

      const elementHeight = element.scrollHeight || element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Position relative to viewport
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const elementTop = element.offsetTop;

      // How far we have scrolled inside the article
      const scrolledInElement = Math.max(0, scrollTop - elementTop + windowHeight * 0.3);
      const scrollableDistance = Math.max(1, elementHeight - windowHeight * 0.5);

      const percent = Math.min(100, Math.max(0, Math.round((scrolledInElement / scrollableDistance) * 100)));
      setProgressPercent(percent);

      const remaining = Math.max(1, Math.ceil(totalMinutes * (1 - percent / 100)));
      setRemainingMinutes(remaining);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef, totalMinutes]);

  return { progressPercent, remainingMinutes };
}
