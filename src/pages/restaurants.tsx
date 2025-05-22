import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader, MobileBottomNav } from "@/components/layout/mobile-nav";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { AddRestaurantDialog } from "@/components/restaurants/add-restaurant-dialog";
import { useRestaurants } from "@/hooks/use-restaurants";
import { Skeleton } from "@/components/ui/skeleton";

export default function Restaurants() {
  const { data, isLoading, error } = useRestaurants();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-sidebar-background py-4 px-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons text-primary mr-2">restaurant_menu</span>
          <h1 className="text-xl font-bold text-primary">Choplink</h1>
        </div>
        <div className="flex items-center">
          <span className="material-icons text-sidebar-foreground">account_circle</span>
        </div>
      </header>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background pb-16">
        <section className="p-4 md:p-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Restaurants</h2>
              <p className="text-muted-foreground mt-1">Manage your restaurant listings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <AddRestaurantDialog />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-2">Error loading restaurants</p>
              <p className="text-muted-foreground">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
            </div>
          ) : data?.result && data.result.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.result.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-xl mb-2">No restaurants found</p>
              <p className="text-muted-foreground mb-4">Get started by adding your first restaurant</p>
              <AddRestaurantDialog />
            </div>
          )}
        </section>
      </main>
      
      {/* Mobile bottom nav removed as requested */}
    </div>
  );
}
