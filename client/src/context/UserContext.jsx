import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Create Context
export const userContext = createContext();

// Context Provider Component
export const userContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Check for existing authentication token on page load
  useEffect(() => {
    const storedUser = Cookies.get("all");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://studious-goldfish-9pwrwvp777x3qqq-4242.app.github.dev/api/v1/users/login",
        { email, pass: password }
      );

      Cookies.set("token", response.data.token, {
        expires: 1439 / 1440,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("all", JSON.stringify(response.data), {
        expires: 1439 / 1440,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      setUser(response.data);
      setErrorMessage("");
      window.location.href = "/home"; // Redirect to home page

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Logout Function
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("all");
    setUser(null);
    window.location.href = "/"; // Redirect to login
  };

  return (
    <userContext.Provider value={{ user, login, logout, errorMessage }}>
      {children}
    </userContext.Provider>
  );
};
