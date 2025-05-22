import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type MenuItemFilters } from "@/lib/types";

interface MenuFiltersProps {
  filters: MenuItemFilters;
  onFilterChange: (filters: MenuItemFilters) => void;
}

export function MenuFilters({ filters, onFilterChange }: MenuFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleDishTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      dishType: value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value,
    });
  };

  return (
    <div className="mb-6 bg-sidebar-background p-4 rounded-lg">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label htmlFor="menu-search" className="block text-muted-foreground text-sm mb-1">
            Search
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <span className="material-icons text-sm">search</span>
            </span>
            <Input
              id="menu-search"
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              placeholder="Search menu items..."
              value={filters.search}
              onChange={handleSearchChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dish-type-filter" className="block text-muted-foreground text-sm mb-1">
            Dish Type
          </label>
          <Select
            value={filters.dishType}
            onValueChange={handleDishTypeChange}
          >
            <SelectTrigger id="dish-type-filter" className="bg-muted border-border text-foreground w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="main">Main Dishes</SelectItem>
              <SelectItem value="side">Side Dishes</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
              <SelectItem value="drink">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="status-filter" className="block text-muted-foreground text-sm mb-1">
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter" className="bg-muted border-border text-foreground w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
