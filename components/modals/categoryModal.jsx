import { useState, useEffect } from "react";

export default function CategoryModal({ isOpen, closeModal, endpoint }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing categories
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);

      fetch(`${endpoint}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

  // Add a new category
  const handleAddCategory = () => {
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
        setCategories([...categories, newCategory]);
        setCategoryName("");
      })
      .catch((err) => console.error(err));
  };

  // Delete a category
  const handleDeleteCategory = (id) => {
    fetch(`${endpoint}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Include token for authorization
      },
    })
      .then(() => setCategories(categories.filter((cat) => cat._id !== id)))
      .catch((err) => console.error("raja",err));
    
  };

  return isOpen ? (
    <div className="modal">
      <h2>Manage Categories</h2>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Enter category name"
      />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            {cat.name}
            <button onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={closeModal}>Close</button>
    </div>
  ) : null;
}
