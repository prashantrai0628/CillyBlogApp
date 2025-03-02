import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../utils/constant"; // Import BACKEND_URL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState();
  const [profile, setProfile] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage
      if (token) {
        const { data } = await axios.get(`${BACKEND_URL}/users/my-profile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setProfile(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      // If there's an error (e.g., token is invalid), clear the authentication state
      localStorage.removeItem("jwt");
      setProfile(null);
      setIsAuthenticated(false);
    }
  };

  // Function to fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/blogs/all-blogs`, {
        withCredentials: true,
      });
      setBlogs(data);
    } catch (error) {
      console.log(error);
    }
  };

  // On component mount, fetch blogs and profile
  useEffect(() => {
    fetchBlogs();
    fetchProfile();
  }, []);

  // Function to handle login
  const login = (token, userProfile) => {
    localStorage.setItem("jwt", token); // Store the token in localStorage
    setProfile(userProfile); // Set the user profile
    setIsAuthenticated(true); // Set authentication state to true
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("jwt"); // Remove the token from localStorage
    setProfile(null); // Clear the user profile
    setIsAuthenticated(false); // Set authentication state to false
  };

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        login, // Provide login function
        logout, // Provide logout function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
