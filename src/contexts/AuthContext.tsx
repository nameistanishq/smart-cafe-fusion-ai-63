
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Demo users for testing
const DEMO_USERS: Record<string, User> = {
  "student@example.com": {
    id: "s1",
    email: "student@example.com",
    name: "Alex Student",
    role: "student",
    walletBalance: 500,
    profileImage: "/assets/avatars/placeholder.jpg",
  },
  "staff@example.com": {
    id: "s2",
    email: "staff@example.com",
    name: "Taylor Staff",
    role: "staff",
    walletBalance: 1000,
    profileImage: "/assets/avatars/placeholder.jpg",
  },
  "cafeteria@example.com": {
    id: "c1",
    email: "cafeteria@example.com",
    name: "Casey Cafeteria",
    role: "cafeteria",
    walletBalance: 0,
    profileImage: "/assets/avatars/placeholder.jpg",
  },
  "admin@example.com": {
    id: "a1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    walletBalance: 0,
    profileImage: "/assets/avatars/placeholder.jpg",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("smartCafeteriaUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("smartCafeteriaUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerEmail = email.toLowerCase();
    if (DEMO_USERS[lowerEmail] && password === "password") {
      const loggedInUser = DEMO_USERS[lowerEmail];
      setUser(loggedInUser);
      localStorage.setItem("smartCafeteriaUser", JSON.stringify(loggedInUser));
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartCafeteriaUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
