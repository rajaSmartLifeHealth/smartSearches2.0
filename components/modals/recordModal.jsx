import React, { useState } from "react";
import axios from "axios";

export default function RecordModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [recordName, setRecordName] = useState("");
  const [category, setcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Retrieve token from localStorage
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.post(
        endpoint + '/records',
        { name: recordName, category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      onSubmit(response.data); // Pass the newly added record to parent
      setRecordName("");
      setcategory("");
      closeModal();
    } catch (err) {
      setError("Failed to save the record. Please try again.");
      console.error("Error submitting record:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Record Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recordName">Record Name</label>
            <input
              type="text"
              id="recordName"
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              placeholder="Enter record name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <textarea
              id="description"
              value={category}
              onChange={(e) => setcategory(e.target.value)}
              placeholder="Enter a brief category"
              rows="3"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

