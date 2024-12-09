import { useEffect, useState } from "react";
import AuthApp from "../components/AuthApp"; // Authentication component
import "../styles/globals.css";
import "../styles/App.css";
import "../styles/practiceModal.css";
import "../styles/categoryModal.css";
import "../styles/metricModal.css";
import "../styles/patientModal.css";
import "../styles/recordModal.css"
import "../styles/AuthApp.css";

import axios from "axios"; // For API calls

function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for validation

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Call an API to validate the token
          await axios.get("https://backend-poc-tsp9.onrender.com/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken"); // Remove invalid token
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    ); // Optional loading screen
  }

  return (
    <div>
      {isAuthenticated ? (
        <Component {...pageProps} />
      ) : (
        <AuthApp />
      )}
    </div>
  );
}

export default MyApp;
