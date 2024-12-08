import { useEffect, useState } from "react";
import AuthApp from "../components/AuthApp"; // Your AuthApp component
import "../styles/globals.css"; // Assuming global styles are in globals.css
import "../styles/App.css"; // Global CSS
import "../styles/InputModal.css"; // Global CSS
import "../styles/AuthApp.css";

function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a valid token in localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // Optionally, you can verify the token via an API if needed
      setIsAuthenticated(true);
    }
  }, []);

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

