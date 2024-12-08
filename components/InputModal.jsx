import { useState, useEffect } from "react";

export default function InputModal({ isOpen, closeModal, title, placeholder, onSubmit, endpoint }) {
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && endpoint) {
      setIsLoading(true);
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      console.log(token);
      fetch(endpoint, {
        method: "GET",
        headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${token}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setValues(Array.isArray(data) ? data : []);
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint]);

  const handleSubmit = () => {
    if (endpoint) {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      console.log(token);

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
          // Include the token in the Authorization header
        },
        body: JSON.stringify({ values }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to submit data");
        })
        .then((result) => {
          console.log("Data successfully submitted:", result);
          onSubmit(values);
          closeModal();
        })
        .catch((error) => console.error("Error posting data:", error))
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleAddValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <input
          type="text"
          className="modal-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="add-button" onClick={handleAddValue}>
          Add
        </button>
        <div className="values-container">
          <h3>Values Added:</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="values-list">
              {values.map((value, index) => (
                <li key={index} className="value-item">
                  {value.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-buttons">
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
          <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
