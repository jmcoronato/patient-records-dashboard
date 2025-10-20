/**
 * Validation schemas for patients using Zod
 */

import { z } from "zod";
import { MESSAGES, VALIDATION_LIMITS } from "@/constants/app";

/**
 * Schema para validar URLs
 */
const urlSchema = z
    .string()
    .url(MESSAGES.VALIDATION.WEBSITE_INVALID)
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
        message: MESSAGES.VALIDATION.WEBSITE_INVALID,
    });

/**
 * Schema principal de paciente
 */
export const patientSchema = z.object({
    name: z
        .string()
        .min(VALIDATION_LIMITS.NAME.MIN, MESSAGES.VALIDATION.NAME_REQUIRED)
        .max(
            VALIDATION_LIMITS.NAME.MAX,
            `Name cannot exceed ${VALIDATION_LIMITS.NAME.MAX} characters`
        )
        .trim(),

    description: z
        .string()
        .min(
            VALIDATION_LIMITS.DESCRIPTION.MIN,
            `Description must have at least ${VALIDATION_LIMITS.DESCRIPTION.MIN} characters`
        )
        .max(
            VALIDATION_LIMITS.DESCRIPTION.MAX,
            `Description cannot exceed ${VALIDATION_LIMITS.DESCRIPTION.MAX} characters`
        )
        .trim(),

    website: urlSchema,

    avatar: urlSchema.refine(
        (url) => {
            // Validate that it's a common image URL
            const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
            return imageExtensions.some((ext) => url.toLowerCase().includes(ext)) || url.includes("avatar");
        },
        {
            message: "URL must be a valid image",
        }
    ).optional().or(z.literal("")).or(urlSchema),
});

/**
 * Schema para formulario de paciente (sin id ni createdAt)
 */
export const patientFormSchema = patientSchema;