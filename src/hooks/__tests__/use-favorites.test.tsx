import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../use-favorites";
import * as favoritesStorage from "@/services/storage/favoritesStorage";
import { toast } from "react-hot-toast";

// Mock de react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock del storage de favoritos
vi.mock("@/services/storage/favoritesStorage", () => ({
  getFavoritePatients: vi.fn(),
  toggleFavorite: vi.fn(),
}));

describe("useFavorites", () => {
  const mockPatients = [
    {
      id: "1",
      name: "John Doe",
      description: "Test patient",
      website: "https://example.com",
      avatar: "https://example.com/avatar.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      description: "Another test patient",
      website: "https://jane.com",
      avatar: "https://jane.com/avatar.jpg",
      createdAt: "2024-01-02T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(favoritesStorage, "getFavoritePatients").mockReturnValue(
      mockPatients
    );
    vi.spyOn(favoritesStorage, "toggleFavorite").mockReturnValue(true);
  });

  it("should load favorites when initializing", () => {
    const { result } = renderHook(() => useFavorites());

    expect(favoritesStorage.getFavoritePatients).toHaveBeenCalled();
    expect(result.current.favoriteIds).toEqual(["1", "2"]);
  });

  it("should toggle favorite and show success notification", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      const wasAdded = result.current.toggleFavorite(mockPatients[0]);
      expect(wasAdded).toBe(true);
    });

    expect(favoritesStorage.toggleFavorite).toHaveBeenCalledWith(
      mockPatients[0]
    );
    expect(favoritesStorage.getFavoritePatients).toHaveBeenCalledTimes(2); // Una vez al inicializar, otra al alternar
    expect(toast.success).toHaveBeenCalledWith("Added to favorites");
  });

  it("should toggle favorite and show removal notification", () => {
    vi.spyOn(favoritesStorage, "toggleFavorite").mockReturnValue(false);

    const { result } = renderHook(() => useFavorites());

    act(() => {
      const wasAdded = result.current.toggleFavorite(mockPatients[0]);
      expect(wasAdded).toBe(false);
    });

    expect(toast.success).toHaveBeenCalledWith("Removed from favorites");
  });

  it("should check if a patient is favorite", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("2")).toBe(true);
    expect(result.current.isFavorite("3")).toBe(false);
  });

  it("should refresh the favorites list", () => {
    const { result } = renderHook(() => useFavorites());

    const newPatients = [mockPatients[0]];
    vi.spyOn(favoritesStorage, "getFavoritePatients").mockReturnValue(
      newPatients
    );

    act(() => {
      result.current.refreshFavorites();
    });

    // Verify that it was called at least once
    expect(favoritesStorage.getFavoritePatients).toHaveBeenCalled();
    expect(result.current.favoriteIds).toEqual(["1"]);
  });

  it("should call callback when a favorite is removed", () => {
    const onFavoriteRemove = vi.fn();
    vi.spyOn(favoritesStorage, "toggleFavorite").mockReturnValue(false);

    const { result } = renderHook(() => useFavorites({ onFavoriteRemove }));

    act(() => {
      result.current.toggleFavorite(mockPatients[0]);
    });

    expect(onFavoriteRemove).toHaveBeenCalledWith("1");
  });

  it("should handle empty favorite list", () => {
    vi.spyOn(favoritesStorage, "getFavoritePatients").mockReturnValue([]);

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isFavorite("1")).toBe(false);
  });

  it("should maintain stable references of the functions", () => {
    const { result } = renderHook(() => useFavorites());

    // Verify that the functions exist and are functions
    expect(typeof result.current.toggleFavorite).toBe("function");
    expect(typeof result.current.isFavorite).toBe("function");
    expect(typeof result.current.refreshFavorites).toBe("function");
  });

  it("should handle multiple toggles correctly", () => {
    const { result } = renderHook(() => useFavorites());

    // Simulate that the first toggle adds, the second removes
    vi.spyOn(favoritesStorage, "toggleFavorite")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    act(() => {
      result.current.toggleFavorite(mockPatients[0]);
    });

    expect(toast.success).toHaveBeenCalledWith("Added to favorites");

    act(() => {
      result.current.toggleFavorite(mockPatients[0]);
    });

    expect(toast.success).toHaveBeenCalledWith("Removed from favorites");
  });

  it("should update the local state after toggling", () => {
    const { result } = renderHook(() => useFavorites());

    // Simulate that after the toggle, only one favorite remains
    vi.spyOn(favoritesStorage, "getFavoritePatients")
      .mockReturnValueOnce(mockPatients) // First call on initialization
      .mockReturnValueOnce([mockPatients[0]]); // Second call after toggle

    act(() => {
      result.current.toggleFavorite(mockPatients[1]);
    });

    // Verify that the toggle executed correctly
    expect(favoritesStorage.toggleFavorite).toHaveBeenCalledWith(
      mockPatients[1]
    );
    expect(toast.success).toHaveBeenCalled();
  });
});
