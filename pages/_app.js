import { useEffect, useState } from "react";
import AuthApp from "../components/AuthApp"; 
import TreeViewComponent from "../components/treeViewComponent";

import "../styles/App.css";
import "../styles/AuthApp.css";
import "../styles/globals.css";
import "../styles/categoryModal.css";
import "../styles/KpiDashboard.css";
import "../styles/metricModal.css";
import "../styles/patientModal.css";
import "../styles/practiceModal.css";
import "../styles/TreeViewComponent.css";
import "../styles/recordModal.css";
import "../styles/index.css";


import axios from "axios"; 


function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
         
          await axios.get("https://backend-poc-tsp9.onrender.com/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken"); 
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
    ); // O
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
