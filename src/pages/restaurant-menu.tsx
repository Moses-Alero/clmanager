import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader, MobileBottomNav } from "@/components/layout/mobile-nav";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { AddMenuItemDialog } from "@/components/menu/add-menu-item-dialog";
import { MenuFilters } from "@/components/menu/menu-filters";
import { useRestaurant } from "@/hooks/use-restaurants";
import { useMenuItems } from "@/hooks/use-menu-items";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type MenuItem } from "@shared/schema";
import { type MenuItemFilters } from "@/lib/types";

export default function RestaurantMenu() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = parseInt(id);
  
  const [filters, setFilters] = useState<MenuItemFilters>({
    search: "",
    dishType: "all",
    status: "all",
  });
  
  const { data: restaurantData, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuData, isLoading: isLoadingMenu } = useMenuItems(restaurantId);
  
  const filteredMenuItems = useMemo(() => {
    if (!menuData?.result) return [];
    
    return menuData.result.filter((item) => {
      // Search filter
      const matchesSearch = filters.search === "" || 
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
      
      // Dish type filter
      const matchesDishType = filters.dishType === "all" || item.dish_type === filters.dishType;
      
      // Status filter
      const matchesStatus = filters.status === "all" || item.status === filters.status;
      
      return matchesSearch && matchesDishType && matchesStatus;
    });
  }, [menuData, filters]);
  
  // Group menu items by dish type
  const menuItemsByType = useMemo(() => {
    const groupedItems: Record<string, MenuItem[]> = {
      main: [],
      side: [],
      dessert: [],
      drink: [],
    };
    
    filteredMenuItems.forEach((item) => {
      if (groupedItems[item.dish_type]) {
        groupedItems[item.dish_type].push(item);
      } else {
        groupedItems.main.push(item);
      }
    });
    
    return groupedItems;
  }, [filteredMenuItems]);
  
  const isLoading = isLoadingRestaurant || isLoadingMenu;
  const restaurant = restaurantData?.result;
  
  const handleFilterChange = (newFilters: MenuItemFilters) => {
    setFilters(newFilters);
  };
  
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
              <div className="flex items-center">
                <Link href="/">
                  <div className="inline-flex items-center justify-center mr-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                    <span className="material-icons">arrow_back</span>
                  </div>
                </Link>
                <h2 className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    `${restaurant?.name || "Restaurant"} Menu`
                  )}
                </h2>
              </div>
              <p className="text-muted-foreground mt-1">Manage your menu items</p>
            </div>
            <div className="mt-4 md:mt-0">
              {!isLoading && <AddMenuItemDialog restaurantId={restaurantId} />}
            </div>
          </div>

          {!isLoading && (
            <MenuFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          )}

          {isLoading ? (
            <div className="space-y-8">
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xl mb-2">No menu items found</p>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.dishType !== "all" || filters.status !== "all"
                  ? "No items match your filters. Try adjusting your search criteria."
                  : "Get started by adding your first menu item"}
              </p>
              {filters.search || filters.dishType !== "all" || filters.status !== "all" ? (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ search: "", dishType: "all", status: "all" })}
                >
                  Clear Filters
                </Button>
              ) : (
                <AddMenuItemDialog restaurantId={restaurantId} />
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main dishes */}
              {menuItemsByType.main.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="material-icons mr-2 text-primary">restaurant</span>
                    Main Dishes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItemsByType.main.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} restaurantId={restaurantId} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Side dishes */}
              {menuItemsByType.side.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="material-icons mr-2 text-primary">lunch_dining</span>
                    Side Dishes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItemsByType.side.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} restaurantId={restaurantId} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Desserts */}
              {menuItemsByType.dessert.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="material-icons mr-2 text-primary">cake</span>
                    Desserts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItemsByType.dessert.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} restaurantId={restaurantId} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Drinks */}
              {menuItemsByType.drink.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="material-icons mr-2 text-primary">local_bar</span>
                    Drinks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItemsByType.drink.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} restaurantId={restaurantId} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      {/* Mobile bottom nav removed as requested */}
    </div>
  );
}
