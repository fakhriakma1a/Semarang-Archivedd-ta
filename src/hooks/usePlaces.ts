/**
 * React Query Hooks for Places
 * 
 * This module provides custom hooks for managing place data using React Query.
 * All hooks automatically handle caching, loading states, error handling, and cache invalidation.
 * 
 * Query Hooks (Read Operations):
 * - usePlaces() - Fetch all places with optional filters
 * - usePlace() - Fetch single place by ID
 * - useRandomPlace() - Fetch random place for randomizer
 * - usePlaceStatistics() - Fetch statistics
 * 
 * Mutation Hooks (Write Operations):
 * - useCreatePlace() - Create new place
 * - useUpdatePlace() - Update existing place
 * - useDeletePlace() - Delete place
 * - useToggleFavorite() - Toggle favorite status
 * - useToggleVisited() - Toggle visited status
 * - useClearAllPlaces() - Delete all places
 * 
 * All mutations include automatic cache invalidation and toast notifications.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlaceService } from '@/services/placeService';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Place = Database['public']['Tables']['places']['Row'];
type PlaceInsert = Database['public']['Tables']['places']['Insert'];
type PlaceUpdate = Database['public']['Tables']['places']['Update'];

// Query keys untuk React Query
export const placeKeys = {
  all: ['places'] as const,
  lists: () => [...placeKeys.all, 'list'] as const,
  list: (filters: { category?: string; search?: string; isFavorite?: boolean }) => 
    [...placeKeys.lists(), filters] as const,
  details: () => [...placeKeys.all, 'detail'] as const,
  detail: (id: string) => [...placeKeys.details(), id] as const,
  random: () => [...placeKeys.all, 'random'] as const,
  statistics: () => [...placeKeys.all, 'statistics'] as const,
};

// Hook untuk mendapatkan semua places
export function usePlaces(filters?: { 
  category?: string; 
  search?: string; 
  isFavorite?: boolean;
}) {
  return useQuery({
    queryKey: placeKeys.list(filters || {}),
    queryFn: async () => {
      if (filters?.search) {
        return PlaceService.search(filters.search);
      }
      if (filters?.isFavorite) {
        return PlaceService.getFavorites();
      }
      if (filters?.category && filters.category !== 'all') {
        return PlaceService.getByCategory(
          filters.category as 'cafe' | 'restaurant' | 'mall' | 'historical_place'
        );
      }
      return PlaceService.getAll();
    },
    staleTime: 5 * 60 * 1000, // Data fresh selama 5 menit
  });
}

// Hook untuk mendapatkan single place by ID
export function usePlace(id: string | undefined) {
  return useQuery({
    queryKey: placeKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Place ID is required');
      return PlaceService.getById(id);
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
  });
}

// Hook untuk mendapatkan random place
export function useRandomPlace(category?: 'cafe' | 'restaurant' | 'mall' | 'historical_place' | 'all') {
  return useQuery({
    queryKey: [...placeKeys.random(), category],
    queryFn: () => PlaceService.getRandom(category),
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fetch fresh data
  });
}

// Hook untuk mendapatkan statistics
export function usePlaceStatistics() {
  return useQuery({
    queryKey: placeKeys.statistics(),
    queryFn: () => PlaceService.getStatistics(),
    staleTime: 10 * 60 * 1000, // Stats fresh selama 10 menit
  });
}

// Hook untuk create place
export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlaceInsert) => PlaceService.create(data),
    onSuccess: () => {
      // Invalidate dan refetch places queries
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: placeKeys.statistics() });
      
      toast({
        title: 'Berhasil',
        description: 'Tempat berhasil ditambahkan',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menambahkan tempat',
        variant: 'destructive',
      });
    },
  });
}

// Hook untuk update place
export function useUpdatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlaceUpdate }) => 
      PlaceService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific place dan lists
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: placeKeys.statistics() });
      
      toast({
        title: 'Berhasil',
        description: 'Tempat berhasil diperbarui',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memperbarui tempat',
        variant: 'destructive',
      });
    },
  });
}

// Hook untuk delete place
export function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlaceService.delete(id),
    onSuccess: () => {
      // Invalidate lists dan statistics
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: placeKeys.statistics() });
      
      toast({
        title: 'Berhasil',
        description: 'Tempat berhasil dihapus',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menghapus tempat',
        variant: 'destructive',
      });
    },
  });
}

// Hook untuk toggle favorite
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      PlaceService.toggleFavorite(id, isFavorite),
    onSuccess: (_, variables) => {
      // Update cache secara optimistic
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal mengubah status favorit',
        variant: 'destructive',
      });
    },
  });
}

// Hook untuk toggle visited
export function useToggleVisited() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, visited }: { id: string; visited: boolean }) => 
      PlaceService.toggleVisited(id, visited),
    onSuccess: (_, variables) => {
      // Update cache secara optimistic
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: placeKeys.statistics() });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal mengubah status kunjungan',
        variant: 'destructive',
      });
    },
  });
}

// Hook untuk clear all places (delete all)
export function useClearAllPlaces() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get all places first
      const places = await PlaceService.getAll();
      // Delete all places one by one
      await Promise.all(places.map(place => PlaceService.delete(place.id)));
    },
    onSuccess: () => {
      // Invalidate all queries
      queryClient.invalidateQueries({ queryKey: placeKeys.all });
      
      toast({
        title: 'Berhasil',
        description: 'Semua data berhasil dihapus',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menghapus data',
        variant: 'destructive',
      });
    },
  });
}
