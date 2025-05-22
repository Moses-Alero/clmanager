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
const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Home Ways 🏠",
    description: "Home-style cooking with fresh ingredients",
  },
  {
    id: 2,
    name: "Spice Haven",
    description: "Best spicy foods from around the world",
  },
  {
    id: 3,
    name: "Fresh Bites",
    description: "Healthy and delicious meals",
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
    return res as RestaurantsResponse;
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
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newRestaurant: Restaurant = {
      id: Math.max(...mockRestaurants.map((r) => r.id)) + 1,
      name: data.name,
      description: data.description || null,
    };

    mockRestaurants.push(newRestaurant);

    return {
      status: "success",
      status_code: 201,
      message: "Restaurant created successfully",
      result: newRestaurant,
    };
  },

  // Update a restaurant
  updateRestaurant: async (
    id: number,
    data: InsertRestaurant
  ): Promise<RestaurantResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const restaurantIndex = mockRestaurants.findIndex((r) => r.id === id);

    if (restaurantIndex === -1) {
      throw new Error("Restaurant not found");
    }

    const updatedRestaurant: Restaurant = {
      ...mockRestaurants[restaurantIndex],
      name: data.name,
      description:
        data.description || mockRestaurants[restaurantIndex].description,
    };

    mockRestaurants[restaurantIndex] = updatedRestaurant;

    return {
      status: "success",
      status_code: 200,
      message: "Restaurant updated successfully",
      result: updatedRestaurant,
    };
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
    await new Promise((resolve) => setTimeout(resolve, 700));

    const allMenuItems = Object.values(mockMenuItems).flat();
    const newId = Math.max(...allMenuItems.map((item) => item.id)) + 1;

    const newMenuItem: MenuItem = {
      id: newId,
      name: data.name,
      price: data.price,
      max_portion: data.max_portion || null,
      dish_type: data.dish_type || "main",
      status: data.status || "available",
      description: data.description || null,
      restaurant_id: restaurantId,
    };

    if (!mockMenuItems[restaurantId]) {
      mockMenuItems[restaurantId] = [];
    }

    mockMenuItems[restaurantId].push(newMenuItem);

    return {
      status: "success",
      status_code: 201,
      message: "Menu item created successfully",
      result: newMenuItem,
    };
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
    await new Promise((resolve) => setTimeout(resolve, 600));

    let foundItem = false;

    for (const restaurantId in mockMenuItems) {
      const restaurantMenuItems = mockMenuItems[restaurantId];
      const itemIndex = restaurantMenuItems.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        mockMenuItems[restaurantId].splice(itemIndex, 1);
        foundItem = true;
        break;
      }
    }

    if (!foundItem) {
      throw new Error("Menu item not found");
    }

    return {
      status: "success",
      status_code: 200,
      message: "Menu item deleted successfully",
    };
  },
};
