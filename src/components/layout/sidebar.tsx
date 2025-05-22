import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
}

function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  return (
    <li className="mb-1">
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-4 py-3 rounded-md mx-2 transition-colors duration-200 cursor-pointer",
            isActive
              ? "text-primary bg-sidebar-accent"
              : "text-sidebar-foreground hover:text-primary"
          )}
        >
          <span className="material-icons mr-3">{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const isActive = (path: string) => location === path;
  
  return (
    <aside className="hidden md:flex bg-sidebar-background w-64 flex-shrink-0 flex-col z-10 h-screen border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">Choplink</h1>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          <SidebarLink 
            href="/" 
            icon="restaurant" 
            label="Restaurants" 
            isActive={isActive("/")} 
          />
          <SidebarLink 
            href="#" 
            icon="menu_book" 
            label="Menu Items" 
            isActive={false} 
          />
          <SidebarLink 
            href="#" 
            icon="analytics" 
            label="Reports" 
            isActive={false} 
          />
          <SidebarLink 
            href="#" 
            icon="settings" 
            label="Settings" 
            isActive={false} 
          />
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60">admin@choplink.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
