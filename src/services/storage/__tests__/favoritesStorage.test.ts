import { describe, it, expect, beforeEach } from "vitest";
import {
    getFavoritePatients,
    saveFavoritePatients,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    updateFavoritePatient,
    clearFavorites,
} from "../favoritesStorage";
import { Patient } from "@/types/patient";

const mockPatient1: Patient = {
    id: "1",
    name: "John Doe",
    description: "A test patient",
    website: "https://example.com",
    avatar: "https://example.com/avatar.jpg",
    createdAt: "2024-01-01T00:00:00.000Z",
};

const mockPatient2: Patient = {
    id: "2",
    name: "Jane Smith",
    description: "Another test patient",
    website: "https://example2.com",
    avatar: "https://example2.com/avatar.jpg",
    createdAt: "2024-01-02T00:00:00.000Z",
};

describe("favoritesStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("getFavoritePatients", () => {
        it("debería retornar array vacío si no hay favoritos", () => {
            const result = getFavoritePatients();
            expect(result).toEqual([]);
        });

        it("debería retornar la lista de favoritos guardados", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const result = getFavoritePatients();
            expect(result).toEqual([mockPatient1, mockPatient2]);
        });
    });

    describe("saveFavoritePatients", () => {
        it("debería guardar la lista de favoritos", () => {
            const result = saveFavoritePatients([mockPatient1]);
            expect(result).toBe(true);
            expect(getFavoritePatients()).toEqual([mockPatient1]);
        });

        it("debería sobrescribir la lista existente", () => {
            saveFavoritePatients([mockPatient1]);
            saveFavoritePatients([mockPatient2]);
            expect(getFavoritePatients()).toEqual([mockPatient2]);
        });
    });

    describe("isFavorite", () => {
        it("debería retornar false si el paciente no es favorito", () => {
            expect(isFavorite("1")).toBe(false);
        });

        it("debería retornar true si el paciente es favorito", () => {
            saveFavoritePatients([mockPatient1]);
            expect(isFavorite("1")).toBe(true);
        });

        it("debería retornar false para ID no existente", () => {
            saveFavoritePatients([mockPatient1]);
            expect(isFavorite("999")).toBe(false);
        });
    });

    describe("addToFavorites", () => {
        it("debería agregar un paciente a favoritos", () => {
            const result = addToFavorites(mockPatient1);
            expect(result).toBe(true);
            expect(getFavoritePatients()).toContainEqual(mockPatient1);
        });

        it("debería agregar el paciente al inicio de la lista", () => {
            saveFavoritePatients([mockPatient1]);
            addToFavorites(mockPatient2);
            const favorites = getFavoritePatients();
            expect(favorites[0]).toEqual(mockPatient2);
        });

        it("no debería agregar duplicados", () => {
            addToFavorites(mockPatient1);
            const result = addToFavorites(mockPatient1);
            expect(result).toBe(false);
            expect(getFavoritePatients().length).toBe(1);
        });
    });

    describe("removeFromFavorites", () => {
        it("debería eliminar un paciente de favoritos", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const result = removeFromFavorites("1");
            expect(result).toBe(true);
            expect(getFavoritePatients()).toEqual([mockPatient2]);
        });

        it("debería funcionar si el paciente no existe", () => {
            saveFavoritePatients([mockPatient1]);
            const result = removeFromFavorites("999");
            expect(result).toBe(true);
            expect(getFavoritePatients()).toEqual([mockPatient1]);
        });
    });

    describe("toggleFavorite", () => {
        it("debería agregar el paciente si no es favorito", () => {
            const result = toggleFavorite(mockPatient1);
            expect(result).toBe(true);
            expect(isFavorite("1")).toBe(true);
        });

        it("debería eliminar el paciente si es favorito", () => {
            addToFavorites(mockPatient1);
            const result = toggleFavorite(mockPatient1);
            expect(result).toBe(false);
            expect(isFavorite("1")).toBe(false);
        });

        it("debería alternar correctamente múltiples veces", () => {
            toggleFavorite(mockPatient1); // Agregar
            expect(isFavorite("1")).toBe(true);

            toggleFavorite(mockPatient1); // Eliminar
            expect(isFavorite("1")).toBe(false);

            toggleFavorite(mockPatient1); // Agregar de nuevo
            expect(isFavorite("1")).toBe(true);
        });
    });

    describe("updateFavoritePatient", () => {
        it("debería actualizar un paciente favorito existente", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const updatedPatient = { ...mockPatient1, name: "John Updated" };

            const result = updateFavoritePatient(updatedPatient);
            expect(result).toBe(true);

            const favorites = getFavoritePatients();
            expect(favorites.find((p) => p.id === "1")?.name).toBe("John Updated");
        });

        it("no debería modificar otros pacientes", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const updatedPatient = { ...mockPatient1, name: "John Updated" };

            updateFavoritePatient(updatedPatient);

            const favorites = getFavoritePatients();
            expect(favorites.find((p) => p.id === "2")).toEqual(mockPatient2);
        });

        it("debería mantener el orden de los favoritos", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const updatedPatient = { ...mockPatient2, name: "Jane Updated" };

            updateFavoritePatient(updatedPatient);

            const favorites = getFavoritePatients();
            expect(favorites[0].id).toBe("1");
            expect(favorites[1].id).toBe("2");
        });
    });

    describe("clearFavorites", () => {
        it("debería limpiar todos los favoritos", () => {
            saveFavoritePatients([mockPatient1, mockPatient2]);
            const result = clearFavorites();
            expect(result).toBe(true);
            expect(getFavoritePatients()).toEqual([]);
        });

        it("debería funcionar si no hay favoritos", () => {
            const result = clearFavorites();
            expect(result).toBe(true);
            expect(getFavoritePatients()).toEqual([]);
        });
    });
});

