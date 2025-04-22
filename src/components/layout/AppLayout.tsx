
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import PreLoader from "@/components/PreLoader";
import { 
  Home, ShoppingCart, List, Wallet, User, LogOut, ChefHat, Database, 
  BarChart, Package, UserCircle, Menu as MenuIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const AppLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Skip preloader in development mode
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     setShowPreloader(false);
  //   }
  // }, []);

  // Get appropriate navigation based on user role
  const getNavItems = () => {
    if (!user) {
      // Public navigation for guest users
      return [
        { icon: <Home size={20} />, label: "Menu", path: "/menu" },
        { icon: <ShoppingCart size={20} />, label: "Cart", path: "/checkout", badge: count > 0 ? count : undefined },
        { icon: <User size={20} />, label: "Login", path: "/login" },
      ];
    }

    if (user.role === "student" || user.role === "staff") {
      // Student/Staff navigation
      return [
        { icon: <Home size={20} />, label: "Menu", path: "/menu" },
        { icon: <ShoppingCart size={20} />, label: "Cart", path: "/checkout", badge: count > 0 ? count : undefined },
        { icon: <List size={20} />, label: "Orders", path: "/orders" },
        { icon: <Wallet size={20} />, label: "Wallet", path: "/wallet" },
        { icon: <UserCircle size={20} />, label: "Profile", path: "/profile" },
      ];
    }

    if (user.role === "cafeteria") {
      // Cafeteria staff navigation
      return [
        { icon: <ShoppingCart size={20} />, label: "Billing", path: "/cafeteria/billing" },
        { icon: <List size={20} />, label: "Orders", path: "/cafeteria/orders" },
        { icon: <MenuIcon size={20} />, label: "Menu", path: "/cafeteria/menu" },
      ];
    }

    if (user.role === "admin") {
      // Admin navigation
      return [
        { icon: <BarChart size={20} />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <Package size={20} />, label: "Inventory", path: "/admin/inventory" },
        { icon: <Database size={20} />, label: "Waste", path: "/admin/waste" },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  // Determine if the current user role should see the main navigation
  const shouldShowBottomNav = () => {
    if (!user) return true; // Guest users see navigation
    return user.role === "student" || user.role === "staff";
  };

  if (showPreloader) {
    return <PreLoader />;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen flex-col bg-cafe-dark text-cafe-text">
      {/* Header for all users */}
      <header className="sticky top-0 z-10 border-b border-cafe-primary/20 bg-cafe-surface shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold"
            >
              {user?.role === "admin" ? (
                <span className="text-cafe-primary">Admin Dashboard</span>
              ) : user?.role === "cafeteria" ? (
                <span className="text-cafe-primary">Cafeteria Staff</span>
              ) : (
                <>
                  <span className="text-cafe-primary">Smart</span> Cafeteria
                </>
              )}
            </motion.div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:block mr-4 text-sm">
                  <span className="text-cafe-text/70">Hello, </span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-cafe-primary hover:bg-cafe-primary/10"
                >
                  <LogOut size={20} />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="hidden md:flex text-cafe-primary hover:bg-cafe-primary/10"
              >
                <User size={18} className="mr-2" />
                Login
              </Button>
            )}

            {/* Mobile menu button - only for staff roles that don't use bottom nav */}
            {!shouldShowBottomNav() && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-cafe-primary hover:bg-cafe-primary/10"
              >
                <MenuIcon size={20} />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu drawer for staff roles */}
      <AnimatePresence>
        {isMobileMenuOpen && !shouldShowBottomNav() && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-cafe-surface border-l border-cafe-primary/20 shadow-lg md:hidden"
          >
            <div className="flex flex-col h-full pt-16">
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-cafe-primary hover:bg-cafe-primary/10"
                >
                  <LogOut size={20} />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.path)
                          ? "bg-cafe-primary text-white"
                          : "text-cafe-text hover:bg-cafe-primary/10"
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t border-cafe-primary/20">
                <Button
                  variant="outline"
                  className="w-full justify-start border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto py-4 px-4 md:py-6 md:px-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation - only for students/staff/guest */}
      {shouldShowBottomNav() && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-cafe-surface border-t border-cafe-primary/20 shadow-lg md:hidden z-10"
        >
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="icon"
                className={`flex h-16 w-16 flex-col items-center justify-center rounded-none border-t-2 text-xs ${
                  isActive(item.path)
                    ? "border-cafe-primary text-cafe-primary"
                    : "border-transparent text-cafe-text/70"
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cafe-primary text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1">{item.label}</span>
              </Button>
            ))}
          </div>
        </motion.nav>
      )}
    </div>
  );
};

export default AppLayout;
