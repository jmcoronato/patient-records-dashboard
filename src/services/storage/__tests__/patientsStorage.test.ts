import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    getLocalPatients,
    saveLocalPatients,
    addLocalPatient,
    updateLocalPatient,
    deleteLocalPatient,
    isLocalPatient,
    getLocalPatient,
    clearLocalPatients,
} from "../patientsStorage";
import { Patient } from "@/types/patient";

const mockPatient: Patient = {
    id: "1",
    name: "John Doe",
    description: "A test patient",
    website: "https://example.com",
    avatar: "https://example.com/avatar.jpg",
    createdAt: "2024-01-01T00:00:00.000Z",
};

describe("patientsStorage", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe("getLocalPatients", () => {
        it("debería retornar array vacío si no hay pacientes locales", () => {
            const result = getLocalPatients();
            expect(result).toEqual([]);
        });

        it("debería retornar la lista de pacientes locales", () => {
            saveLocalPatients([mockPatient]);
            const result = getLocalPatients();
            expect(result).toEqual([mockPatient]);
        });
    });

    describe("saveLocalPatients", () => {
        it("debería guardar la lista de pacientes", () => {
            const result = saveLocalPatients([mockPatient]);
            expect(result).toBe(true);
            expect(getLocalPatients()).toEqual([mockPatient]);
        });
    });

    describe("addLocalPatient", () => {
        it("debería agregar un nuevo paciente local con ID y createdAt", () => {
            const patientData = {
                name: "Jane Doe",
                description: "A new patient",
                website: "https://example.com",
                avatar: "https://example.com/avatar.jpg",
            };

            const result = addLocalPatient(patientData);

            expect(result).toMatchObject(patientData);
            expect(result.id).toBeDefined();
            expect(result.createdAt).toBeDefined();
        });

        it("debería agregar el paciente al inicio de la lista", () => {
            saveLocalPatients([mockPatient]);

            const newPatientData = {
                name: "New Patient",
                description: "Description",
                website: "https://new.com",
                avatar: "https://new.com/avatar.jpg",
            };

            const newPatient = addLocalPatient(newPatientData);
            const patients = getLocalPatients();

            expect(patients[0]).toEqual(newPatient);
            expect(patients[1]).toEqual(mockPatient);
        });

        it("debería generar IDs únicos", () => {
            const patientData = {
                name: "Test",
                description: "Test description",
                website: "https://test.com",
                avatar: "https://test.com/avatar.jpg",
            };

            // Simular avance de tiempo para asegurar IDs distintos basados en Date.now()
            const nowSpy = vi
                .spyOn(Date, "now")
                .mockReturnValueOnce(1000)
                .mockReturnValueOnce(2000);

            const patient1 = addLocalPatient(patientData);
            const patient2 = addLocalPatient(patientData);

            expect(patient1.id).not.toBe(patient2.id);
            nowSpy.mockRestore();
        });
    });

    describe("updateLocalPatient", () => {
        it("debería actualizar un paciente local existente", () => {
            saveLocalPatients([mockPatient]);

            const updates = { name: "Updated Name" };
            const result = updateLocalPatient("1", updates);

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Updated Name");
            expect(result?.id).toBe("1");
        });

        it("debería crear una copia local si el paciente no existe", () => {
            const result = updateLocalPatient("999", {
                name: "New Patient",
                description: "Description",
                website: "https://test.com",
                avatar: "https://test.com/avatar.jpg",
            });

            expect(result).not.toBeNull();
            expect(result?.id).toBe("999");
            expect(isLocalPatient("999")).toBe(true);
        });

        it("debería mantener el ID original al actualizar", () => {
            saveLocalPatients([mockPatient]);

            const updates = { id: "999", name: "Updated" };
            const result = updateLocalPatient("1", updates);

            expect(result?.id).toBe("1"); // The ID should not change
        });

        it("debería actualizar solo los campos proporcionados", () => {
            saveLocalPatients([mockPatient]);

            const updates = { name: "New Name" };
            const result = updateLocalPatient("1", updates);

            expect(result?.name).toBe("New Name");
            expect(result?.description).toBe(mockPatient.description);
            expect(result?.website).toBe(mockPatient.website);
        });
    });

    describe("deleteLocalPatient", () => {
        it("debería eliminar un paciente local", () => {
            saveLocalPatients([mockPatient]);

            const result = deleteLocalPatient("1");

            expect(result).toBe(true);
            expect(getLocalPatients()).toEqual([]);
        });

        it("debería retornar true aunque el paciente no exista", () => {
            const result = deleteLocalPatient("999");
            expect(result).toBe(true);
        });
    });

    describe("isLocalPatient", () => {
        it("debería retornar true si el paciente existe localmente", () => {
            saveLocalPatients([mockPatient]);
            expect(isLocalPatient("1")).toBe(true);
        });

        it("debería retornar false si el paciente no existe", () => {
            expect(isLocalPatient("999")).toBe(false);
        });
    });

    describe("getLocalPatient", () => {
        it("debería retornar el paciente si existe", () => {
            saveLocalPatients([mockPatient]);
            const result = getLocalPatient("1");
            expect(result).toEqual(mockPatient);
        });

        it("debería retornar null si el paciente no existe", () => {
            const result = getLocalPatient("999");
            expect(result).toBeNull();
        });
    });

    describe("clearLocalPatients", () => {
        it("debería limpiar todos los pacientes locales", () => {
            saveLocalPatients([mockPatient]);

            const result = clearLocalPatients();

            expect(result).toBe(true);
            expect(getLocalPatients()).toEqual([]);
        });
    });
});

