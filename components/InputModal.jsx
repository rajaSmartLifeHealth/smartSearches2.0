import { useState } from "react";

export default function InputModal({ isOpen, closeModal, title, placeholder, onSubmit }) {
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState([]);

  const handleAddValue = () => {
    if (inputValue.trim()) {
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleSubmit = () => {
    onSubmit(values); // Pass values to the parent
    closeModal(); // Close the modal
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
          <ul className="values-list">
            {values.map((value, index) => (
              <li key={index} className="value-item">
                {value}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-buttons">
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
