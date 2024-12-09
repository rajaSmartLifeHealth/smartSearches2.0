import { useState, useEffect } from "react";

export default function CategoryModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // For error handling

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear any previous error when re-opening the modal

      fetch(`${endpoint}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => {
          setError("Failed to load categories.");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

  // Add a new category
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setIsLoading(true);
    fetch(`${endpoint}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: categoryName }),
    })
      .then((res) => res.json())
      .then((newCategory) => {
        setCategories([...categories, newCategory]); // Add new category to the list
        setCategoryName(""); // Clear the input field after adding the category
        setError(""); // Clear any previous error
        onSubmit && onSubmit(newCategory); // Call onSubmit if provided (for parent handling)
      })
      .catch((err) => {
        setError("Failed to add category.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  // Delete a category
  const handleDeleteCategory = (id) => {
    setIsLoading(true);
    fetch(`${endpoint}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authorization
      },
    })
      .then(() => setCategories(categories.filter((cat) => cat._id !== id)))
      .catch((err) => {
        setError("Failed to delete category.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Categories</h2>

        {/* Error message display */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          disabled={isLoading}
        />
        <button onClick={handleAddCategory} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Category"}
        </button>

        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              {cat.name}
              <button onClick={() => handleDeleteCategory(cat._id)} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={closeModal} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
