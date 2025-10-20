import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModalState } from "../use-modal-state";

describe("useModalState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with the modal closed and no data", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it("should open the modal", () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should open the modal with data", () => {
    const { result } = renderHook(() => useModalState<string>());

    act(() => {
      result.current.open("test data");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toBe("test data");
  });

  it("should close the modal", () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should clean the data after closing with delay", () => {
    const { result } = renderHook(() => useModalState<string>());

    act(() => {
      result.current.open("test data");
    });

    expect(result.current.data).toBe("test data");

    act(() => {
      result.current.close();
    });

    // Data should still be present immediately
    expect(result.current.data).toBe("test data");

    // Advance time to allow animation
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.data).toBeNull();
  });

  it("should set data manually", () => {
    const { result } = renderHook(() => useModalState<string>());

    act(() => {
      result.current.setData("manual data");
    });

    expect(result.current.data).toBe("manual data");
  });

  it("should handle complex objects", () => {
    interface TestData {
      id: number;
      name: string;
    }

    const { result } = renderHook(() => useModalState<TestData>());
    const testData = { id: 1, name: "Test" };

    act(() => {
      result.current.open(testData);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(testData);
  });

  it("should overwrite data when opening with new data", () => {
    const { result } = renderHook(() => useModalState<string>());

    act(() => {
      result.current.open("first data");
    });

    expect(result.current.data).toBe("first data");

    act(() => {
      result.current.open("second data");
    });

    expect(result.current.data).toBe("second data");
  });

  it("should maintain stable callbacks", () => {
    const { result, rerender } = renderHook(() => useModalState());

    const firstOpen = result.current.open;
    const firstClose = result.current.close;

    rerender();

    expect(result.current.open).toBe(firstOpen);
    expect(result.current.close).toBe(firstClose);
  });
});
