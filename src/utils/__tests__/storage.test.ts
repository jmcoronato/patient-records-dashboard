import { describe, it, expect, beforeEach, vi } from "vitest";
import { StorageAdapter } from "../storage";

describe("StorageAdapter", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("get", () => {
        it("debería retornar null cuando no hay datos", () => {
            const adapter = new StorageAdapter<string>("test-key");
            expect(adapter.get()).toBeNull();
        });

        it("debería obtener y parsear datos correctamente", () => {
            const adapter = new StorageAdapter<{ name: string }>("test-key");
            const data = { name: "John" };
            localStorage.setItem("test-key", JSON.stringify(data));

            expect(adapter.get()).toEqual(data);
        });

        it("debería retornar null si hay error al parsear", () => {
            const adapter = new StorageAdapter<any>("test-key");
            localStorage.setItem("test-key", "invalid json");
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            expect(adapter.get()).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe("getOrDefault", () => {
        it("debería retornar el valor por defecto si no hay datos", () => {
            const adapter = new StorageAdapter<string>("test-key");
            expect(adapter.getOrDefault("default")).toBe("default");
        });

        it("debería retornar los datos almacenados si existen", () => {
            const adapter = new StorageAdapter<string>("test-key");
            localStorage.setItem("test-key", JSON.stringify("stored"));

            expect(adapter.getOrDefault("default")).toBe("stored");
        });
    });

    describe("set", () => {
        it("debería guardar datos correctamente", () => {
            const adapter = new StorageAdapter<{ name: string }>("test-key");
            const data = { name: "John" };

            expect(adapter.set(data)).toBe(true);
            expect(JSON.parse(localStorage.getItem("test-key")!)).toEqual(data);
        });

        it("debería retornar false si hay error al guardar", () => {
            const adapter = new StorageAdapter<any>("test-key");
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Forzar fallo en JSON.stringify para garantizar el catch
            const stringifySpy = vi
                .spyOn(JSON, "stringify")
                .mockImplementationOnce(() => {
                    throw new Error("stringify error");
                }) as any;

            expect(adapter.set({ data: "test" })).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();

            stringifySpy.mockRestore();
            consoleSpy.mockRestore();
        });
    });

    describe("remove", () => {
        it("debería eliminar datos correctamente", () => {
            const adapter = new StorageAdapter<string>("test-key");
            localStorage.setItem("test-key", JSON.stringify("data"));

            expect(adapter.remove()).toBe(true);
            expect(localStorage.getItem("test-key")).toBeNull();
        });

        it("debería retornar false si hay error al eliminar", () => {
            const adapter = new StorageAdapter<any>("test-key");
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            const original = (global.localStorage as any).removeItem;
            (global.localStorage as any).removeItem = () => {
                throw new Error("remove error");
            };

            expect(adapter.remove()).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();

            (global.localStorage as any).removeItem = original;
            consoleSpy.mockRestore();
        });
    });

    describe("exists", () => {
        it("debería retornar false cuando no hay datos", () => {
            const adapter = new StorageAdapter<string>("test-key");
            expect(adapter.exists()).toBe(false);
        });

        it("debería retornar true cuando hay datos", () => {
            const adapter = new StorageAdapter<string>("test-key");
            localStorage.setItem("test-key", JSON.stringify("data"));

            expect(adapter.exists()).toBe(true);
        });
    });

    describe("update", () => {
        it("debería actualizar datos usando una función updater", () => {
            const adapter = new StorageAdapter<number>("test-key");
            adapter.set(5);

            adapter.update((current) => (current ?? 0) + 10);

            expect(adapter.get()).toBe(15);
        });

        it("debería manejar caso cuando no hay datos previos", () => {
            const adapter = new StorageAdapter<number>("test-key");

            adapter.update((current) => (current ?? 0) + 10);

            expect(adapter.get()).toBe(10);
        });

        it("debería retornar true si la actualización es exitosa", () => {
            const adapter = new StorageAdapter<number>("test-key");
            adapter.set(5);

            const result = adapter.update((current) => (current ?? 0) + 10);

            expect(result).toBe(true);
        });
    });
});

