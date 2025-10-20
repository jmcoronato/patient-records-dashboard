/**
 * Hook for handling infinite scroll of patients using React Query
 * Provides automatic cache, revalidation, and better state management
 */

import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Patient, InfiniteScrollState } from "@/types/patient";
import { fetchPatients, getLocalPatients } from "@/services/patientService";
import { PAGINATION, MESSAGES } from "@/constants/app";

const ITEMS_PER_PAGE = PAGINATION.ITEMS_PER_PAGE;

/**
 * Main hook that uses React Query for fetching with infinite scroll
 */
export const useInfinitePatientsQuery = () => {
  // React Query handles everything: cache, refetch, loading states, etc.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["patients"], // Key for the cache
    queryFn: async ({ pageParam = 1 }) => {
      // Get local patients only on the first page
      if (pageParam === 1) {
        const localPatients = getLocalPatients();
        const apiPatients = await fetchPatients({
          page: pageParam,
          limit: ITEMS_PER_PAGE,
        });

        // Filter duplicates between local and API
        const localIds = new Set(localPatients.map((p) => p.id));
        const uniqueApiPatients = apiPatients.filter(
          (p) => !localIds.has(p.id)
        );

        return {
          patients: [...localPatients, ...uniqueApiPatients],
          nextPage:
            apiPatients.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
        };
      }

      // For subsequent pages, only API
      const apiPatients = await fetchPatients({
        page: pageParam,
        limit: ITEMS_PER_PAGE,
      });

      return {
        patients: apiPatients,
        nextPage: apiPatients.length === ITEMS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    // React Query configuration
    staleTime: 1000 * 60 * 5, // Data is "fresh" for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true, // Refetch when returning to window
    retry: 1, // Only retry 1 time in case of error
  });

  // Combine all patients from all pages
  const allPatients = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.patients);
  }, [data]);

  // Load more patients (infinite scroll)
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Refresh from the beginning (only when necessary, e.g.: errors)
  const refreshPatients = useCallback(() => {
    refetch();
  }, [refetch]);

  // Convert to InfiniteScrollState interface for compatibility
  const state: InfiniteScrollState = useMemo(
    () => ({
      patients: allPatients,
      currentPage: data?.pages.length || 1,
      hasMore: hasNextPage || false,
      isLoading: isLoading || isFetchingNextPage,
      error: error
        ? (error as Error).message || MESSAGES.ERROR.LOAD_PATIENTS
        : null,
    }),
    [
      allPatients,
      data?.pages.length,
      hasNextPage,
      isLoading,
      isFetchingNextPage,
      error,
    ]
  );

  return useMemo(
    () => ({
      ...state,
      loadMore,
      reset: refreshPatients, // reset is the same as refetch
      refreshPatients,
      // updatePatientInList is no longer needed - mutations update the cache directly
    }),
    [state, loadMore, refreshPatients]
  );
};
