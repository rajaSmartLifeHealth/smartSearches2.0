import { useState, useEffect } from "react";

export default function CategoryModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear error on open
      setCategoryName(""); // Reset input field

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
        setCategories((prev) => [...prev, newCategory]);
        setCategoryName(""); // Clear input field
        setError(""); // Clear error message
        if (onSubmit) onSubmit(newCategory); // Pass new category to parent
      })
      .catch((err) => {
        setError("Failed to add category.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteCategory = (id) => {
    setIsLoading(true);
    fetch(`${endpoint}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => setCategories((prev) => prev.filter((cat) => cat._id !== id)))
      .catch((err) => {
        setError("Failed to delete category.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  // Close modal and clear states when the modal is closed
  const handleClose = () => {
    setCategoryName("");
    setError("");
    closeModal();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Categories</h2>

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

        <button onClick={handleClose} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
