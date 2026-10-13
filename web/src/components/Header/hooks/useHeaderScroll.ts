
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 8;

export function useHeaderScroll(): boolean {
  const [isScrolled, setIsScrolled] = useState(
    () => window.scrollY > SCROLL_THRESHOLD,
  );

  useEffect(() => {
    let frameId: number | null = null;

    const updateScrollState = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        const nextState = window.scrollY > SCROLL_THRESHOLD;

        setIsScrolled((currentState) =>
          currentState === nextState
            ? currentState
            : nextState,
        );

        frameId = null;
      });
    };

    window.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    updateScrollState();

    return () => {
      window.removeEventListener("scroll", updateScrollState);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return isScrolled;
}