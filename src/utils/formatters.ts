/**
 * Funciones utilitarias para formateo de datos
 */

import { VALIDATION_LIMITS } from "@/constants/app";

/**
 * Obtiene las iniciales de un nombre para el avatar fallback
 */
export const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, VALIDATION_LIMITS.INITIALS_LENGTH);
};

/**
 * Formatea una fecha a string localizado
 */
export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString();
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString();
};

/**
 * Truncates text to a maximum length
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

