import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "../use-intersection-observer";

describe("useIntersectionObserver", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockCallback: (entries: IntersectionObserverEntry[]) => void;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock de IntersectionObserver
    global.IntersectionObserver = vi.fn((callback) => {
      mockCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(() => []),
        root: null,
        rootMargin: "",
        thresholds: [],
      };
    }) as unknown as typeof IntersectionObserver;
  });

  it("should create a ref", () => {
    const onIntersect = vi.fn();
    const { result } = renderHook(() =>
      useIntersectionObserver({ onIntersect })
    );

    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull(); // No element assigned yet
  });

  it("should observe the element when assigned", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect });
      // Simulate element assignment
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    // Debe haber llamado a observe con el elemento
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it("should call the callback when the element is visible", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    // Simular que el elemento es visible
    if (mockCallback) {
      mockCallback([
        {
          isIntersecting: true,
          target: element,
        } as unknown as IntersectionObserverEntry,
      ]);
    }

    expect(onIntersect).toHaveBeenCalled();
  });

  it("should not call the callback when the element is not visible", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    // Simular que el elemento NO es visible
    if (mockCallback) {
      mockCallback([
        {
          isIntersecting: false,
          target: element,
        } as unknown as IntersectionObserverEntry,
      ]);
    }

    expect(onIntersect).not.toHaveBeenCalled();
  });

  it("should not observe when enabled is false", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect, enabled: false });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    // Should not create the observer
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("should disconnect the observer when unmounting", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    const { unmount } = renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should accept custom options", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({
        onIntersect,
        rootMargin: "100px",
        threshold: 0.5,
      });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "100px",
        threshold: 0.5,
      })
    );
  });

  it("should use default values correctly", () => {
    const onIntersect = vi.fn();
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useIntersectionObserver({ onIntersect });
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      return ref;
    });

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        root: null,
        rootMargin: "0px",
        threshold: 0,
      })
    );
  });
});
