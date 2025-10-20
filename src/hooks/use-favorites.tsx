/**
 * Hook for handling patient favorites
 * Manages favorites state and related operations
 */

import { useState, useEffect, useCallback } from "react";
import { Patient } from "@/types/patient";
import {
  getFavoritePatients,
  toggleFavorite as toggleFavoriteService,
} from "@/services/storage/favoritesStorage";
import { toast } from "react-hot-toast";
import { MESSAGES } from "@/constants/app";

interface UseFavoritesOptions {
  onFavoriteRemove?: (patientId: string) => void;
}

export const useFavorites = (options: UseFavoritesOptions = {}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    const favorites = getFavoritePatients();
    setFavoriteIds(favorites.map((p) => p.id));
  }, []);

  /**
   * Toggles the favorite status of a patient
   */
  const toggleFavorite = useCallback(
    (patient: Patient) => {
      const wasAdded = toggleFavoriteService(patient);

      // Update local state
      const favorites = getFavoritePatients();
      setFavoriteIds(favorites.map((p) => p.id));

      // Notify if it was removed
      if (!wasAdded && options.onFavoriteRemove) {
        options.onFavoriteRemove(patient.id);
      }

      // Show notification
      toast.success(
        wasAdded
          ? MESSAGES.SUCCESS.ADDED_TO_FAVORITES
          : MESSAGES.SUCCESS.REMOVED_FROM_FAVORITES
      );

      return wasAdded;
    },
    [options]
  );

  /**
   * Checks if a patient is favorite
   */
  const isFavorite = useCallback(
    (patientId: string) => {
      return favoriteIds.includes(patientId);
    },
    [favoriteIds]
  );

  /**
   * Refreshes the favorites list
   */
  const refreshFavorites = useCallback(() => {
    const favorites = getFavoritePatients();
    setFavoriteIds(favorites.map((p) => p.id));
  }, []);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
  };
};
