import React, { createContext, useContext, useState, ReactNode } from "react";
import { RenderMenu, RenderRoutes } from "../components/header/Header";
import Footer from "../components/footer/Footer";

// Define the shape of the user object
interface User {
  name: string;
  isAuthenticated: boolean;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User;
  login: (userName: string, password: string) => Promise<string>;
  logout: () => void;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ name: "", isAuthenticated: true });

  const login = (userName: string, password: string) => {
    return new Promise<string>((resolve, reject) => {
      if (password === "password") {
        setUser({ name: userName, isAuthenticated: true });
        resolve("success");
      } else {
        reject("Incorrect password");
      }
    });
  };

  const logout = () => {
    setUser({ name: "", isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main layout component
export const MainLayout: React.FC = () => {
  return (
    <>
      <RenderMenu />
      <RenderRoutes />
      <Footer />
    </>
  );
};