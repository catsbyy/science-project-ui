import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { RenderMenu, RenderRoutes } from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { BaseUser } from "../types/UserTypes.ts";
import { useNavigate } from "react-router-dom";

// Define the shape of the user object
type User = BaseUser & {
  companyName?: string;
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
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    id: null,
    name: "",
    surname: "",
    email: "",
    password: "",
    companyName: "",
    role: "candidate",
    isAuthenticated: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // This ensures cookies are sent
        });

        const data = await response.json();

        setUser({
          id: data.user.id,
          name: data.user.name,
          surname: data.user.surname,
          email: data.user.email,
          companyName: data.user.company_name,
          password: "", 
          role: data.user.role,
          isAuthenticated: true,
        });
      } catch (err) {
        console.error("Error fetching user: ", err);
      }
    };

    fetchUser();
  }, []);

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
        id: data.user.id,
        name: data.user.name,
        surname: data.user.surname,
        email: data.user.email,
        companyName: data.user.company_name,
        password: password,
        role: data.user.role,
        isAuthenticated: true,
      });

      return data;
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
  
      const data = await response.json();
  
      console.log("Server response:", data);
  
      if (!response.ok) {
        console.error("Response not OK:", response.status);
        throw new Error(data.error || "Registration failed"); 
      }
  
      return data;
    } catch (error) {
      console.error("Error in register:", error); 
      return Promise.reject(error);  
    }
  };
  

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser({
        id: null,
        name: "",
        surname: "",
        email: "",
        password: "",
        companyName: "",
        role: "candidate",
        isAuthenticated: false,
      });

      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
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
