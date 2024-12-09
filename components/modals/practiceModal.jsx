import { useState, useEffect } from "react";

export default function PracticeModal({ isOpen, closeModal, endpoint }) {
  const [practices, setPractices] = useState([]);
  const [practiceName, setPracticeName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories and practices
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
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
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint]);

  // Add a new practice
  const handleAddPractice = () => {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    fetch(`${endpoint}/practices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
      body: JSON.stringify({ name: practiceName, category: selectedCategory }),
    })
      .then((res) => res.json())
      .then((newPractice) => {
        setPractices([...practices, newPractice]);
        setPracticeName("");
        setSelectedCategory("");
      })
      .catch((err) => console.error(err));
  };

  return isOpen ? (
    <div className="modal">
      <h2>Manage Practices</h2>
      <input
        type="text"
        value={practiceName}
        onChange={(e) => setPracticeName(e.target.value)}
        placeholder="Enter practice name"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
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
      <button onClick={handleAddPractice}>Add Practice</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {practices.map((practice) => (
            <li key={practice._id}>{practice.name}</li>
          ))}
        </ul>
      )}
      <button onClick={closeModal}>Close</button>
    </div>
  ) : null;
}

