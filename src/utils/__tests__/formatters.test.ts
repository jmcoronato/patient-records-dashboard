import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    getInitials,
    formatDate,
    formatDateTime,
    truncateText,
    capitalize,
} from "../formatters";

describe("formatters", () => {
    describe("getInitials", () => {
        it("debería obtener iniciales de un nombre simple", () => {
            expect(getInitials("John Doe")).toBe("JD");
        });

        it("debería obtener iniciales de un nombre con múltiples palabras", () => {
            expect(getInitials("John Michael Doe")).toBe("JM");
        });

        it("debería limitar a 2 caracteres", () => {
            expect(getInitials("A B C D E")).toBe("AB");
        });

        it("debería convertir a mayúsculas", () => {
            expect(getInitials("john doe")).toBe("JD");
        });

        it("debería manejar nombres con espacios extra", () => {
            expect(getInitials("John  Doe")).toBe("JD");
        });
    });

    describe("formatDate", () => {
        beforeEach(() => {
            // Mock de toLocaleDateString para tener resultados consistentes
            vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("1/1/2024");
        });

        it("debería formatear un string de fecha", () => {
            const result = formatDate("2024-01-01");
            expect(result).toBe("1/1/2024");
        });

        it("debería formatear un objeto Date", () => {
            const date = new Date("2024-01-01");
            const result = formatDate(date);
            expect(result).toBe("1/1/2024");
        });
    });

    describe("formatDateTime", () => {
        beforeEach(() => {
            // Mock de toLocaleString para tener resultados consistentes
            vi.spyOn(Date.prototype, "toLocaleString").mockReturnValue(
                "1/1/2024, 12:00:00 PM"
            );
        });

        it("debería formatear un string de fecha con hora", () => {
            const result = formatDateTime("2024-01-01T12:00:00");
            expect(result).toBe("1/1/2024, 12:00:00 PM");
        });

        it("debería formatear un objeto Date con hora", () => {
            const date = new Date("2024-01-01T12:00:00");
            const result = formatDateTime(date);
            expect(result).toBe("1/1/2024, 12:00:00 PM");
        });
    });

    describe("truncateText", () => {
        it("debería truncar texto que excede el límite", () => {
            const text = "Este es un texto muy largo";
            expect(truncateText(text, 10)).toBe("Este es un...");
        });

        it("no debería truncar texto que no excede el límite", () => {
            const text = "Corto";
            expect(truncateText(text, 10)).toBe("Corto");
        });

        it("debería manejar texto exactamente del límite", () => {
            const text = "Exacto";
            expect(truncateText(text, 6)).toBe("Exacto");
        });

        it("debería agregar puntos suspensivos al truncar", () => {
            const text = "12345678901234567890";
            const result = truncateText(text, 10);
            expect(result).toContain("...");
            expect(result.length).toBe(13); // 10 caracteres + "..."
        });
    });

    describe("capitalize", () => {
        it("debería capitalizar la primera letra", () => {
            expect(capitalize("hello")).toBe("Hello");
        });

        it("debería convertir el resto a minúsculas", () => {
            expect(capitalize("HELLO")).toBe("Hello");
        });

        it("debería manejar texto mixto", () => {
            expect(capitalize("hELLo")).toBe("Hello");
        });

        it("debería manejar string vacío", () => {
            expect(capitalize("")).toBe("");
        });

        it("debería manejar un solo carácter", () => {
            expect(capitalize("a")).toBe("A");
        });
    });
});

