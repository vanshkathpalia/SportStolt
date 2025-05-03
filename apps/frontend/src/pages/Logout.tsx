import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth token
    localStorage.removeItem("token");

    // Optional: Clear any other sensitive state if needed
    // e.g., user profile, post drafts, etc.

    // Redirect to signin
    navigate("/signin");
  }, []);

  return null; // or a spinner/loading state
};
