/**
 * Client API for patients
 * Handles all HTTP calls related to patients
 */

import { Patient } from "@/types/patient";
import { API_CONFIG } from "@/constants/app";

export interface FetchPatientsParams {
    page?: number;
    limit?: number;
    name?: string;
}

/**
 * Get a list of patients from the API
 */
export const fetchPatients = async (
    params: FetchPatientsParams = {}
): Promise<Patient[]> => {
    const { page = 1, limit = 10 } = params;

    const url = `${API_CONFIG.BASE_URL}?page=${page}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch patients from the API");
    }

    return response.json();
};

