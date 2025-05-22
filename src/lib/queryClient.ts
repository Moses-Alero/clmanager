import { QueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/services/api";

// Function to throw error if response is not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const errorMessage =
      errorData?.message || `HTTP error! status: ${res.status}`;
    throw new Error(errorMessage);
  }
}

// Generic API request function for real API calls when needed
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Build the complete URL
  const url = `${BASE_URL}${endpoint}`;

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    abidoshaker: "secret",
    "Access-Control-Allow-Origin": "*",
    ...options.headers,
  };

  // Make the request
  const response = await fetch(url, { ...options, headers });

  // Check if the response is OK
  await throwIfResNotOk(response);

  // Parse and return the JSON response
  return response.json();
}

// Configure the query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});
