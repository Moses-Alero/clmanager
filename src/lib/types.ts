import { type Restaurant, type MenuItem } from "../../shared/schema";

export interface ApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  result?: T;
}

export interface RestaurantsResponse extends ApiResponse<Restaurant[]> {
  result: Restaurant[];
}

export interface RestaurantResponse extends ApiResponse<Restaurant> {
  result: Restaurant;
}

export interface MenuItemsResponse extends ApiResponse<MenuItem[]> {
  result: MenuItem[];
}

export interface MenuItemResponse extends ApiResponse<MenuItem> {
  result: MenuItem;
}

export type DishType = "main" | "side" | "dessert" | "chicken" | "drink";
export type MenuItemStatus = "available" | "unavailable";

export interface MenuItemFilters {
  search: string;
  dishType: string;
  status: string;
}
