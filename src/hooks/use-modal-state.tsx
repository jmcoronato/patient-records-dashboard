/**
 * Generic hook for managing modal state
 * Reusable for any modal that needs to open/close
 */

import { useState, useCallback } from "react";

export interface UseModalStateReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  setData: (data: T | null) => void;
}

/**
 * Hook for managing modal state with optional data
 */
export function useModalState<T = undefined>(): UseModalStateReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay to allow closing animation
    setTimeout(() => setData(null), 150);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    setData,
  };
}
