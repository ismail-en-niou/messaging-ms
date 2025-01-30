import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// ✅ Correct naming: Use PascalCase for context
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUser = Cookies.get("all");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:4242/api/v1/users/login",
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
      window.location.href = "/home";
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("all");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, login, logout, errorMessage }}>
      {children}
    </UserContext.Provider>
  );
};
