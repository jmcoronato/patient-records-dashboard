import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollToTop } from "../use-scroll-to-top";
import { PAGINATION } from "@/constants/app";

describe("useScrollToTop", () => {
  beforeEach(() => {
    // Reset the scroll
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      value: 0,
    });

    Object.defineProperty(document.documentElement, "scrollTop", {
      writable: true,
      value: 0,
    });

    // Mock the scrollTo
    window.scrollTo = vi.fn();
  });

  it("should initialize with showBackToTop in false", () => {
    const { result } = renderHook(() => useScrollToTop());
    expect(result.current.showBackToTop).toBe(false);
  });

  it("should show the button when the scroll exceeds the threshold", () => {
    const { result } = renderHook(() => useScrollToTop(300));

    act(() => {
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(true);
  });

  it("should not show the button when the scroll is below the threshold", () => {
    const { result } = renderHook(() => useScrollToTop(300));

    act(() => {
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 200,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(false);
  });

  it("should use the default threshold of the constants", () => {
    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: PAGINATION.SCROLL_THRESHOLD + 100,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(true);
  });

  it("should call scrollTo with correct configuration", () => {
    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should toggle showBackToTop according to the scroll", () => {
    const { result } = renderHook(() => useScrollToTop(300));

    // Scroll down
    act(() => {
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(true);

    // Scroll up
    act(() => {
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 100,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(false);
  });

  it("should clean the event listener when unmounting", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollToTop());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should use document.documentElement.scrollTop if pageYOffset is not available", () => {
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      value: 0,
    });

    Object.defineProperty(document.documentElement, "scrollTop", {
      writable: true,
      value: 400,
    });

    const { result } = renderHook(() => useScrollToTop(300));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.showBackToTop).toBe(true);
  });
});
