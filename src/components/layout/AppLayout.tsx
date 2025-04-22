
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Home, ShoppingCart, Wallet, List, LogOut, User } from "lucide-react";
import PreLoader from "@/components/PreLoader";

const AppLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Only show preloader on first load
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");
    
    if (hasSeenPreloader) {
      setShowPreloader(false);
    } else {
      const timer = setTimeout(() => {
        setShowPreloader(false);
        sessionStorage.setItem("hasSeenPreloader", "true");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Don't show the navigation for admin and cafeteria pages
  const shouldShowNav = 
    !location.pathname.includes("/admin") && 
    !location.pathname.includes("/cafeteria") &&
    !location.pathname.includes("/login");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { 
      label: "Menu", 
      icon: <Home className="h-5 w-5" />, 
      path: "/menu" 
    },
    { 
      label: "Orders", 
      icon: <List className="h-5 w-5" />, 
      path: "/orders" 
    },
    { 
      label: "Cart", 
      icon: <ShoppingCart className="h-5 w-5" />, 
      path: "/checkout" 
    },
    { 
      label: "Wallet", 
      icon: <Wallet className="h-5 w-5" />, 
      path: "/wallet" 
    },
  ];

  return (
    <>
      {showPreloader && <PreLoader />}
      
      <div className="relative min-h-screen bg-cafe-dark">
        <main className="pb-16">
          <Outlet />
        </main>
        
        {shouldShowNav && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-cafe-primary/20 bg-cafe-darker z-10">
            <NavigationMenu className="max-w-full mx-auto">
              <NavigationMenuList className="flex w-full">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path} className="flex-1">
                    <NavigationMenuLink asChild>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "w-full h-16 flex flex-col items-center justify-center space-y-1 rounded-none",
                          location.pathname === item.path 
                            ? "text-cafe-primary bg-cafe-primary/10" 
                            : "text-cafe-text/70 hover:text-cafe-text hover:bg-cafe-dark/50"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                
                {isAuthenticated ? (
                  <NavigationMenuItem className="flex-1">
                    <NavigationMenuLink asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full h-16 flex flex-col items-center justify-center space-y-1 rounded-none text-cafe-text/70 hover:text-cafe-text hover:bg-cafe-dark/50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="text-xs">Logout</span>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem className="flex-1">
                    <NavigationMenuLink asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full h-16 flex flex-col items-center justify-center space-y-1 rounded-none text-cafe-text/70 hover:text-cafe-text hover:bg-cafe-dark/50"
                        onClick={() => navigate("/login")}
                      >
                        <User className="h-5 w-5" />
                        <span className="text-xs">Login</span>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>
    </>
  );
};

export default AppLayout;
