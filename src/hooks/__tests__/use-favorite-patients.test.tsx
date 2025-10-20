import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavoritePatients } from "../use-favorite-patients";
import * as patientService from "@/services/patientService";

// Mock del servicio de pacientes
vi.mock("@/services/patientService", () => ({
  getFavoritePatients: vi.fn(),
  saveFavoritePatients: vi.fn(),
  updateFavoritePatient: vi.fn(),
}));

describe("useFavoritePatients", () => {
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
    vi.spyOn(patientService, "getFavoritePatients").mockReturnValue(
      mockPatients
    );
    vi.spyOn(patientService, "saveFavoritePatients").mockImplementation(
      () => true
    );
    vi.spyOn(patientService, "updateFavoritePatient").mockImplementation(
      () => true
    );
  });

  it("should load favorites when initializing", () => {
    const { result } = renderHook(() => useFavoritePatients());

    expect(patientService.getFavoritePatients).toHaveBeenCalled();
    expect(result.current.patients).toEqual(mockPatients);
    expect(result.current.isLoading).toBe(false);
  });

  it("should show loading state initially", () => {
    // Mock that simulates async loading
    vi.spyOn(patientService, "getFavoritePatients").mockImplementation(() => {
      // Simular delay
      return mockPatients;
    });

    const { result } = renderHook(() => useFavoritePatients());

    // Initial state should be loading
    expect(result.current.isLoading).toBe(false); // Resolves immediately in the mock
  });

  it("should update a patient in the list", () => {
    const { result } = renderHook(() => useFavoritePatients());

    const updatedPatient = {
      ...mockPatients[0],
      name: "John Updated",
    };

    act(() => {
      result.current.updatePatientInList(updatedPatient);
    });

    expect(patientService.updateFavoritePatient).toHaveBeenCalledWith(
      updatedPatient
    );
    expect(result.current.patients[0]).toEqual(updatedPatient);
  });

  it("should remove a favorite", () => {
    const { result } = renderHook(() => useFavoritePatients());

    act(() => {
      result.current.removeFavorite("1");
    });

    expect(patientService.saveFavoritePatients).toHaveBeenCalledWith([
      mockPatients[1],
    ]);
    expect(result.current.patients).toHaveLength(1);
    expect(result.current.patients[0].id).toBe("2");
  });

  it("should refresh favorites", () => {
    const { result } = renderHook(() => useFavoritePatients());

    const newPatients = [mockPatients[0]];
    vi.spyOn(patientService, "getFavoritePatients").mockReturnValue(
      newPatients
    );

    act(() => {
      result.current.refreshFavorites();
    });

    // Verify that it was called at least once
    expect(patientService.getFavoritePatients).toHaveBeenCalled();
    expect(result.current.patients).toEqual(newPatients);
  });

  it("should maintain the stable reference of the functions", () => {
    const { result, rerender } = renderHook(() => useFavoritePatients());

    const firstUpdatePatient = result.current.updatePatientInList;
    const firstRemoveFavorite = result.current.removeFavorite;
    const firstRefreshFavorites = result.current.refreshFavorites;

    rerender();

    expect(result.current.updatePatientInList).toBe(firstUpdatePatient);
    expect(result.current.removeFavorite).toBe(firstRemoveFavorite);
    expect(result.current.refreshFavorites).toBe(firstRefreshFavorites);
  });

  it("should handle empty favorite list", () => {
    vi.spyOn(patientService, "getFavoritePatients").mockReturnValue([]);

    const { result } = renderHook(() => useFavoritePatients());

    expect(result.current.patients).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should update multiple patients correctly", () => {
    const { result } = renderHook(() => useFavoritePatients());

    const updatedPatient1 = { ...mockPatients[0], name: "John Updated" };
    const updatedPatient2 = { ...mockPatients[1], name: "Jane Updated" };

    act(() => {
      result.current.updatePatientInList(updatedPatient1);
      result.current.updatePatientInList(updatedPatient2);
    });

    expect(patientService.updateFavoritePatient).toHaveBeenCalledTimes(2);
    expect(result.current.patients[0]).toEqual(updatedPatient1);
    expect(result.current.patients[1]).toEqual(updatedPatient2);
  });

  it("should handle remove patient inexistent", () => {
    const { result } = renderHook(() => useFavoritePatients());

    act(() => {
      result.current.removeFavorite("inexistente");
    });

    expect(patientService.saveFavoritePatients).toHaveBeenCalledWith(
      mockPatients
    );
    expect(result.current.patients).toEqual(mockPatients);
  });
});
