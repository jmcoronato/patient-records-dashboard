import { describe, it, expect } from "vitest";
import { patientSchema, patientFormSchema } from "../patient.schema";

describe("patientSchema", () => {
    const validPatient = {
        name: "John Doe",
        description: "This is a valid description with more than 10 characters",
        website: "https://example.com",
        avatar: "https://example.com/avatar.jpg",
    };

    describe("name validation", () => {
        it("should accept a valid name", () => {
            const result = patientSchema.safeParse(validPatient);
            expect(result.success).toBe(true);
        });

        it("should reject empty name", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                name: "",
            });
            expect(result.success).toBe(false);
        });

        it("should reject name too long", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                name: "a".repeat(101),
            });
            expect(result.success).toBe(false);
        });

        it("should trim whitespace", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                name: "  John Doe  ",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe("John Doe");
            }
        });
    });

    describe("description validation", () => {
        it("should accept a valid description", () => {
            const result = patientSchema.safeParse(validPatient);
            expect(result.success).toBe(true);
        });

        it("should reject description too short", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                description: "short",
            });
            expect(result.success).toBe(false);
        });

        it("should reject description too long", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                description: "a".repeat(1001), // More than the 1000 character limit
            });
            expect(result.success).toBe(false);
        });

        it("should accept description with minimum 10 characters", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                description: "1234567890", // Exactamente 10 caracteres
            });
            expect(result.success).toBe(true);
        });
    });

    describe("website validation", () => {
        it("should accept URL with https", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                website: "https://example.com",
            });
            expect(result.success).toBe(true);
        });

        it("should accept URL with http", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                website: "http://example.com",
            });
            expect(result.success).toBe(true);
        });

        it("should reject URL without protocol", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                website: "example.com",
            });
            expect(result.success).toBe(false);
        });

        it("should reject invalid URL", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                website: "not-a-url",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("avatar validation", () => {
        it("should accept valid image URL", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                avatar: "https://example.com/image.jpg",
            });
            expect(result.success).toBe(true);
        });

        it("should accept URL with .png", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                avatar: "https://example.com/image.png",
            });
            expect(result.success).toBe(true);
        });

        it("should accept URL with .webp", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                avatar: "https://example.com/image.webp",
            });
            expect(result.success).toBe(true);
        });

        it("should accept URL that contains 'avatar'", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                avatar: "https://example.com/avatar",
            });
            expect(result.success).toBe(true);
        });

        it("should accept empty avatar", () => {
            const result = patientSchema.safeParse({
                ...validPatient,
                avatar: "",
            });
            expect(result.success).toBe(true);
        });

        it("should be optional", () => {
            const { avatar, ...patientWithoutAvatar } = validPatient;
            const result = patientSchema.safeParse(patientWithoutAvatar);
            expect(result.success).toBe(true);
        });
    });

    describe("patientFormSchema", () => {
        it("should be equal to patientSchema", () => {
            expect(patientFormSchema).toBe(patientSchema);
        });

        it("should validate form data correctly", () => {
            const formData = {
                name: "Jane Doe",
                description: "A valid description for testing purposes",
                website: "https://janedoe.com",
                avatar: "https://janedoe.com/avatar.png",
            };

            const result = patientFormSchema.safeParse(formData);
            expect(result.success).toBe(true);
        });
    });
});

