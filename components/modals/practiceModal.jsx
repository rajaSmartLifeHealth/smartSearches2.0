import { useState, useEffect } from "react";

export default function PracticeModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [practices, setPractices] = useState([]);
  const [practiceName, setPracticeName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // For error handling

  // Fetch categories and practices
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear any previous error when re-opening the modal
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }

      // Fetch categories and practices with Authorization header
      Promise.all([
        fetch(`${endpoint}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch(`${endpoint}/practices`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ])
        .then(([categoriesData, practicesData]) => {
          setCategories(categoriesData);
          setPractices(practicesData);
        })
        .catch((err) => {
          setError("Error fetching data.");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint]);

  // Add a new practice
  const handleAddPractice = () => {
    if (!practiceName.trim() || !selectedCategory) {
      setError("Please fill in both fields.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    const payload = {
      name: practiceName,
      category: selectedCategory,
    };

    setIsLoading(true);

    fetch(`${endpoint}/practices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newPractice) => {
        setPractices([...practices, newPractice]);
        setPracticeName(""); // Clear the practice name input field
        setSelectedCategory(""); // Reset the selected category field
        onSubmit && onSubmit(newPractice); // Call onSubmit if provided (for parent handling)
        setError(""); // Clear error if successful
      })
      .catch((err) => {
        setError("Error adding practice.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Practices</h2>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          value={practiceName}
          onChange={(e) => setPracticeName(e.target.value)}
          placeholder="Enter practice name"
          disabled={isLoading}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={isLoading}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddPractice} disabled={isLoading}>
          {isLoading ? "Adding Practice..." : "Add Practice"}
        </button>

        {isLoading ? (
          <p>Loading...</p> // Show loading text while data is being fetched
        ) : (
          <ul>
            {practices.map((practice) => (
              <li key={practice._id}>
                {practice.name} (Category: {practice.category || "No Category"})
              </li>
            ))}
          </ul>
        )}

        <button onClick={closeModal} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
