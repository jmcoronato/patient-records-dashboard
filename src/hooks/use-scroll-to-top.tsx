import { useState, useEffect, useCallback } from "react";
import { PAGINATION } from "@/constants/app";

export const useScrollToTop = (
  threshold: number = PAGINATION.SCROLL_THRESHOLD
) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return { showBackToTop, scrollToTop };
};
