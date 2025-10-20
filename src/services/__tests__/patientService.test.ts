import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    fetchPatients,
    addPatient,
    updatePatient,
} from "../patientService";
import * as patientApi from "../api/patientApi";
import * as patientsStorage from "../storage/patientsStorage";

vi.mock("../api/patientApi");
vi.mock("../storage/patientsStorage");

describe("patientService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe("fetchPatients", () => {
        it("debería llamar a la API para obtener pacientes", async () => {
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

            vi.spyOn(patientApi, "fetchPatients").mockResolvedValueOnce(mockPatients);

            const result = await fetchPatients();

            expect(patientApi.fetchPatients).toHaveBeenCalled();
            expect(result).toEqual(mockPatients);
        });

        it("debería pasar parámetros a la API", async () => {
            vi.spyOn(patientApi, "fetchPatients").mockResolvedValueOnce([]);

            await fetchPatients({ page: 2, limit: 20 });

            expect(patientApi.fetchPatients).toHaveBeenCalledWith({
                page: 2,
                limit: 20,
            });
        });

        it("debería propagar errores de la API", async () => {
            vi.spyOn(patientApi, "fetchPatients").mockRejectedValueOnce(
                new Error("API Error")
            );

            await expect(fetchPatients()).rejects.toThrow("API Error");
        });
    });

    describe("addPatient", () => {
        it("debería agregar un paciente local", () => {
            const patientData = {
                name: "Jane Doe",
                description: "New patient description",
                website: "https://jane.com",
                avatar: "https://jane.com/avatar.jpg",
            };

            const mockResult = {
                id: "123",
                ...patientData,
                createdAt: "2024-01-01T00:00:00.000Z",
            };

            vi.spyOn(patientsStorage, "addLocalPatient").mockReturnValueOnce(
                mockResult
            );

            const result = addPatient(patientData);

            expect(patientsStorage.addLocalPatient).toHaveBeenCalledWith(patientData);
            expect(result).toEqual(mockResult);
        });
    });

    describe("updatePatient", () => {
        it("debería actualizar un paciente local", () => {
            const patientId = "123";
            const updates = { name: "Updated Name" };

            const mockResult = {
                id: patientId,
                name: "Updated Name",
                description: "Description",
                website: "https://example.com",
                avatar: "https://example.com/avatar.jpg",
                createdAt: "2024-01-01T00:00:00.000Z",
            };

            vi.spyOn(patientsStorage, "updateLocalPatient").mockReturnValueOnce(
                mockResult
            );

            const result = updatePatient(patientId, updates);

            expect(patientsStorage.updateLocalPatient).toHaveBeenCalledWith(
                patientId,
                updates
            );
            expect(result).toEqual(mockResult);
        });

        it("debería retornar null si el paciente no se puede actualizar", () => {
            vi.spyOn(patientsStorage, "updateLocalPatient").mockReturnValueOnce(null);

            const result = updatePatient("999", { name: "Test" });

            expect(result).toBeNull();
        });
    });
});

