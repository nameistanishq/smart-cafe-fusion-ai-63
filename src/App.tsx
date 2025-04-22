
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { WasteProvider } from "@/contexts/WasteContext";
import { AiProvider } from "@/contexts/AiContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";

// Layout
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Pages
import LoginPage from "@/pages/LoginPage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderStatusPage from "@/pages/OrderStatusPage";
import OrdersPage from "@/pages/OrdersPage";
import WalletPage from "@/pages/WalletPage";

// Cafeteria Pages
import BillingPage from "@/pages/cafeteria/BillingPage";
import MenuManagerPage from "@/pages/cafeteria/MenuManagerPage";
import OrdersManagerPage from "@/pages/cafeteria/OrdersManagerPage";

// Admin Pages
import DashboardPage from "@/pages/admin/DashboardPage";
import InventoryPage from "@/pages/admin/InventoryPage";
import WastePage from "@/pages/admin/WastePage";

// Not Found
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <OrderProvider>
            <WalletProvider>
              <InventoryProvider>
                <WasteProvider>
                  <AiProvider>
                    <AnalyticsProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/login/:role" element={<LoginPage />} />

                            {/* App Layout Routes */}
                            <Route element={<AppLayout />}>
                              {/* Student/Staff Routes (Public with optional auth) */}
                              <Route path="/menu" element={<MenuPage />} />
                              <Route path="/checkout" element={<CheckoutPage />} />
                              
                              {/* Protected Student/Staff Routes */}
                              <Route path="/orders" element={
                                <ProtectedRoute requiredRole={["student", "staff"]}>
                                  <OrdersPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/order-status/:orderId" element={
                                <ProtectedRoute requiredRole={["student", "staff"]}>
                                  <OrderStatusPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/wallet" element={
                                <ProtectedRoute requiredRole={["student", "staff"]}>
                                  <WalletPage />
                                </ProtectedRoute>
                              } />

                              {/* Cafeteria Staff Routes */}
                              <Route path="/cafeteria/billing" element={
                                <ProtectedRoute requiredRole="cafeteria">
                                  <BillingPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/cafeteria/menu" element={
                                <ProtectedRoute requiredRole="cafeteria">
                                  <MenuManagerPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/cafeteria/orders" element={
                                <ProtectedRoute requiredRole="cafeteria">
                                  <OrdersManagerPage />
                                </ProtectedRoute>
                              } />

                              {/* Admin Routes */}
                              <Route path="/admin/dashboard" element={
                                <ProtectedRoute requiredRole="admin">
                                  <DashboardPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/admin/inventory" element={
                                <ProtectedRoute requiredRole="admin">
                                  <InventoryPage />
                                </ProtectedRoute>
                              } />
                              <Route path="/admin/waste" element={
                                <ProtectedRoute requiredRole="admin">
                                  <WastePage />
                                </ProtectedRoute>
                              } />
                            </Route>

                            {/* Catch-all Not Found Route */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </BrowserRouter>
                      </TooltipProvider>
                    </AnalyticsProvider>
                  </AiProvider>
                </WasteProvider>
              </InventoryProvider>
            </WalletProvider>
          </OrderProvider>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
