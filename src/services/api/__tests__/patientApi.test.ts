import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchPatients } from "../patientApi";
import { API_CONFIG } from "@/constants/app";

describe("patientApi", () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        vi.clearAllMocks();
    });

    describe("fetchPatients", () => {
        it("debería obtener pacientes con parámetros por defecto", async () => {
            const mockPatients = [
                {
                    id: "1",
                    name: "John Doe",
                    description: "Test description",
                    website: "https://example.com",
                    avatar: "https://example.com/avatar.jpg",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
            ];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockPatients,
            });

            const result = await fetchPatients();

            expect(fetch).toHaveBeenCalledWith(
                `${API_CONFIG.BASE_URL}?page=1&limit=10`
            );
            expect(result).toEqual(mockPatients);
        });

        it("debería usar parámetros personalizados de página y límite", async () => {
            const mockPatients = [];

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => mockPatients,
            });

            await fetchPatients({ page: 2, limit: 20 });

            expect(fetch).toHaveBeenCalledWith(
                `${API_CONFIG.BASE_URL}?page=2&limit=20`
            );
        });

        it("debería lanzar error si la respuesta no es ok", async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            await expect(fetchPatients()).rejects.toThrow("Failed to fetch patients");
        });

        it("debería lanzar error si fetch falla", async () => {
            global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

            await expect(fetchPatients()).rejects.toThrow("Network error");
        });

        it("debería manejar respuesta vacía", async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const result = await fetchPatients();
            expect(result).toEqual([]);
        });

        it("debería construir la URL correctamente con diferentes parámetros", async () => {
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            await fetchPatients({ page: 5, limit: 50 });

            expect(fetch).toHaveBeenCalledWith(
                `${API_CONFIG.BASE_URL}?page=5&limit=50`
            );
        });
    });
});

