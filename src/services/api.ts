import { apiRequest } from "@/lib/queryClient";
import {
  Restaurant,
  MenuItem,
  InsertRestaurant,
  InsertMenuItem,
  UpdateMenuItem,
} from "../../shared/schema";
import {
  ApiResponse,
  RestaurantsResponse,
  RestaurantResponse,
  MenuItemsResponse,
  MenuItemResponse,
} from "@/lib/types";

// API base URL that will be used for all requests
export const BASE_URL = "https://choplinks-bot.fly.dev";

// Mock data for restaurants
let mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Home Ways 🏠",
    description: "Home-style cooking with fresh ingredients",
    plate_price: 1000,
    delivery_fee: 200,
  },
  {
    id: 2,
    name: "Spice Haven",
    description: "Best spicy foods from around the world",
    plate_price: 1000,
    delivery_fee: 200,
  },
  {
    id: 3,
    name: "Fresh Bites",
    description: "Healthy and delicious meals",
    plate_price: 1000,
    delivery_fee: 200,
  },
];

// Mock data for menu items based on the spec
const mockMenuItems: Record<number, MenuItem[]> = {
  1: [
    {
      id: 1,
      name: "JOLLOF RICE",
      price: 1100,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Traditional West African rice dish with tomato sauce",
      restaurant_id: 1,
    },
    {
      id: 2,
      name: "FRIED RICE",
      price: 1100,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Rice stir-fried with vegetables and meat",
      restaurant_id: 1,
    },
    {
      id: 3,
      name: "WHITE RICE",
      price: 1050,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Steamed white rice",
      restaurant_id: 1,
    },
    {
      id: 4,
      name: "OFADA RICE",
      price: 1000,
      max_portion: 2,
      dish_type: "main",
      status: "unavailable",
      description: "Nigerian native rice served with spicy sauce",
      restaurant_id: 1,
    },
    {
      id: 9,
      name: "POUNDED YAM",
      price: 500,
      max_portion: 100,
      dish_type: "side",
      status: "unavailable",
      description: "Traditional Nigerian side dish",
      restaurant_id: 1,
    },
    {
      id: 10,
      name: "SEMO",
      price: 500,
      max_portion: 100,
      dish_type: "side",
      status: "unavailable",
      description: "Semolina-based dish",
      restaurant_id: 1,
    },
  ],
  2: [
    {
      id: 5,
      name: "CHICKEN CURRY",
      price: 1500,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Spicy chicken curry with basmati rice",
      restaurant_id: 2,
    },
    {
      id: 6,
      name: "SPICY NOODLES",
      price: 1300,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Stir-fried noodles with vegetables and chili",
      restaurant_id: 2,
    },
  ],
  3: [
    {
      id: 7,
      name: "VEGGIE SALAD",
      price: 950,
      max_portion: 3,
      dish_type: "main",
      status: "available",
      description: "Fresh vegetable salad with light dressing",
      restaurant_id: 3,
    },
    {
      id: 8,
      name: "GRILLED CHICKEN",
      price: 1200,
      max_portion: 2,
      dish_type: "main",
      status: "available",
      description: "Healthy grilled chicken with steamed vegetables",
      restaurant_id: 3,
    },
  ],
};

// Mock API functions that return promises to simulate async API calls
export const api = {
  // Get all restaurants
  getRestaurants: async (): Promise<RestaurantsResponse> => {
    const res = await apiRequest("/restaurant/");
    const response = res as RestaurantsResponse;
    mockRestaurants = response.result;
    return response;
  },

  // Get a single restaurant by ID
  getRestaurant: async (id: number): Promise<RestaurantResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const restaurant = mockRestaurants.find((r) => r.id === id);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return {
      status: "success",
      status_code: 200,
      message: "Restaurant fetched successfully",
      result: restaurant,
    };
  },

  // Create a new restaurant
  createRestaurant: async (
    data: InsertRestaurant
  ): Promise<RestaurantResponse> => {
    const res = await apiRequest(`/restaurant/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res as RestaurantResponse;
  },

  // Update a restaurant
  updateRestaurant: async (
    id: number,
    data: InsertRestaurant
  ): Promise<RestaurantResponse> => {
    const res = await apiRequest(`/restaurant/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res as RestaurantResponse;
  },

  // Get all menu items for a restaurant
  getMenuItems: async (restaurantId: number): Promise<MenuItemsResponse> => {
    const res = await apiRequest(`/restaurant/${restaurantId}/menu`);
    return res as MenuItemsResponse;
  },

  // Get a single menu item
  getMenuItem: async (id: number): Promise<MenuItemResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const menuItem = Object.values(mockMenuItems)
      .flat()
      .find((item) => item.id === id);

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    return {
      status: "success",
      status_code: 200,
      message: "Menu item fetched successfully",
      result: menuItem,
    };
  },

  // Create a new menu item
  createMenuItem: async (
    restaurantId: number,
    data: InsertMenuItem
  ): Promise<MenuItemResponse> => {
    const res = await apiRequest(`/menu/${restaurantId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res as MenuItemResponse;
  },

  // Update a menu item
  updateMenuItem: async (
    id: number,
    data: UpdateMenuItem
  ): Promise<ApiResponse<void>> => {
    const res = await apiRequest(`/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res as ApiResponse<void>;
  },

  // Delete a menu item
  deleteMenuItem: async (id: number): Promise<ApiResponse<void>> => {
    const res = await apiRequest(`/menu/${id}`, {
      method: "DELETE",
    });
    return res as ApiResponse<void>;
  },
};
