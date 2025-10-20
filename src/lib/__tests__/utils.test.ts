import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (class names utility)", () => {
    it("should combine simple classes", () => {
        expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
        const shouldInclude = false;
        expect(cn("class1", shouldInclude && "class2", "class3")).toBe("class1 class3");
    });

    it("should handle tailwind conflicting classes", () => {
        // twMerge should resolve tailwind conflicts
        const result = cn("px-2", "px-4");
        expect(result).toBe("px-4");
    });

    it("should handle arrays of classes", () => {
        expect(cn(["class1", "class2"])).toContain("class1");
        expect(cn(["class1", "class2"])).toContain("class2");
    });

    it("should handle objects with conditional classes", () => {
        const result = cn({
            class1: true,
            class2: false,
            class3: true,
        });
        expect(result).toContain("class1");
        expect(result).not.toContain("class2");
        expect(result).toContain("class3");
    });

    it("should handle undefined and null", () => {
        expect(cn("class1", undefined, null, "class2")).toBe("class1 class2");
    });

    it("should combine tailwind classes correctly", () => {
        const result = cn(
            "bg-red-500 text-white",
            "hover:bg-blue-500",
            "bg-green-500"
        );
        // twMerge should keep the last bg-*
        expect(result).toContain("bg-green-500");
        expect(result).not.toContain("bg-red-500");
        expect(result).toContain("text-white");
        expect(result).toContain("hover:bg-blue-500");
    });
});

