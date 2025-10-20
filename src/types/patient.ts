import { ReactNode } from "react";

/**
 * Types related to patients
 */

/**
 * Main patient interface
 */
export interface Patient {
  id: string;
  name: string;
  description: string;
  website: string;
  avatar: string;
  createdAt: string;
}

/**
 * Type for patient form data (without id and createdAt)
 */
export type PatientFormData = Omit<Patient, "id" | "createdAt">;

/**
 * Type for partial patient update
 */
export type PatientUpdate = Partial<PatientFormData> & {
  id: string;
  createdAt?: string;
};

/**
 * State for infinite scroll
 */
export interface InfiniteScrollState {
  patients: Patient[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Type for search filters
 */
export interface PatientFilters {
  searchQuery?: string;
  isFavorite?: boolean;
}