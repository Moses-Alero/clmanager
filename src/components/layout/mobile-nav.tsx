import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MobileLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function MobileLink({ href, icon, label, isActive, onClick }: MobileLinkProps) {
  return (
    <li className="mb-4">
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer",
            isActive
              ? "text-primary bg-sidebar-accent"
              : "text-sidebar-foreground hover:text-primary"
          )}
          onClick={onClick}
        >
          <span className="material-icons mr-3">{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
}

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const isActive = (path: string) => location === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <>
      <header className="md:hidden bg-sidebar-background py-4 px-4 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Choplink</h1>
        <button 
          className="text-sidebar-foreground focus:outline-none"
          onClick={toggleMenu}
        >
          <span className="material-icons">menu</span>
        </button>
      </header>

      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-sidebar-background z-50 md:hidden fade-in",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="flex justify-end p-4">
          <button 
            className="text-sidebar-foreground focus:outline-none"
            onClick={closeMenu}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <nav className="px-4 py-2">
          <ul>
            <MobileLink 
              href="/" 
              icon="restaurant" 
              label="Restaurants" 
              isActive={isActive("/")} 
              onClick={closeMenu}
            />
            <MobileLink 
              href="#" 
              icon="menu_book" 
              label="Menu Items" 
              isActive={false} 
              onClick={closeMenu}
            />
            <MobileLink 
              href="#" 
              icon="analytics" 
              label="Reports" 
              isActive={false} 
              onClick={closeMenu}
            />
            <MobileLink 
              href="#" 
              icon="settings" 
              label="Settings" 
              isActive={false} 
              onClick={closeMenu}
            />
          </ul>
        </nav>
      </div>
    </>
  );
}

export function MobileBottomNav() {
  const [location] = useLocation();
  const isActive = (path: string) => location === path;
  
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-background border-t border-sidebar-border z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center p-3",
            isActive("/") ? "text-primary" : "text-sidebar-foreground hover:text-primary transition-colors duration-200"
          )}>
            <span className="material-icons">restaurant</span>
            <span className="text-xs mt-1">Restaurants</span>
          </a>
        </Link>
        <Link href="#">
          <a className="flex flex-col items-center p-3 text-sidebar-foreground hover:text-primary transition-colors duration-200">
            <span className="material-icons">menu_book</span>
            <span className="text-xs mt-1">Menu</span>
          </a>
        </Link>
        <Link href="#">
          <a className="flex flex-col items-center p-3 text-sidebar-foreground hover:text-primary transition-colors duration-200">
            <span className="material-icons">analytics</span>
            <span className="text-xs mt-1">Reports</span>
          </a>
        </Link>
        <Link href="#">
          <a className="flex flex-col items-center p-3 text-sidebar-foreground hover:text-primary transition-colors duration-200">
            <span className="material-icons">account_circle</span>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
