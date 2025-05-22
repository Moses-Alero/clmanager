import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type InsertRestaurant } from "../../shared/schema";
import { RestaurantResponse, RestaurantsResponse } from "@/lib/types";
import { api } from "@/services/api";

// Hook to fetch all restaurants
export function useRestaurants() {
  return useQuery<RestaurantsResponse, Error>({
    queryKey: ["/restaurant"],
    queryFn: () => api.getRestaurants(),
  });
}

// Hook to fetch a single restaurant by ID
export function useRestaurant(id: number) {
  return useQuery<RestaurantResponse, Error>({
    queryKey: ["/restaurant", id],
    queryFn: () => api.getRestaurant(id),
    enabled: !!id,
  });
}

// Hook to create a new restaurant
export function useCreateRestaurant() {
  return useMutation<RestaurantResponse, Error, InsertRestaurant>({
    mutationFn: (data) => api.createRestaurant(data),
    onSuccess: () => {
      // Invalidate the query cache for restaurants to refetch the list
      queryClient.invalidateQueries({ queryKey: ["/restaurant"] });
    },
  });
}

// Hook to update a restaurant
export function useUpdateRestaurant() {
  return useMutation<
    RestaurantResponse,
    Error,
    { id: number; data: InsertRestaurant }
  >({
    mutationFn: ({ id, data }) => api.updateRestaurant(id, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/restaurant"] });
      queryClient.invalidateQueries({
        queryKey: ["/restaurant", variables.id],
      });
    },
  });
}
