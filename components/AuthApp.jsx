import { useState } from "react";

export default function AuthApp() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/api/register" : "/api/login";
    try {
      const response = await fetch(`https://backend-poc-tsp9.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(isRegistering ? "Registration Successful!" : "Login Successful!");
        if (data.token) {
            console.log(data);
          localStorage.setItem("authToken", data.token);
        }
      } else {
        const error = await response.json();
        alert(error.message || "An error occurred.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to communicate with the server.");
    }
  };

  return (
    <div className="auth-container">
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {isRegistering && (
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
