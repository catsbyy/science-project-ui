import React, { createContext, useContext, useState, ReactNode } from "react";
import { RenderMenu, RenderRoutes } from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { BaseUser } from "../types/UserTypes.ts";

// Define the shape of the user object
type User = BaseUser & {
  isAuthenticated: boolean;
};

// Define the shape of the AuthContext
interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<string>;
  register: (user: BaseUser) => Promise<string>;
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
  const [user, setUser] = useState<User>({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "candidate",
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      setUser({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: password, // Storing the password might not be necessary or safe, consider not storing it
        role: data.role,
        isAuthenticated: true,
      });

      return "success";
    } catch (error) {
      return Promise.reject("Incorrect email or password");
    }
  };

  const register = async (user: BaseUser) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      setUser({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: "", // Do not store the password in state
        role: data.role,
        isAuthenticated: true,
      });

      return "success";
    } catch (error) {
      return Promise.reject("Registration failed");
    }
  };

  const logout = () => {
    setUser({
      name: "",
      surname: "",
      email: "",
      password: "",
      role: "candidate",
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
