import { useState } from "react";
import InputModal from "../components/InputModal";

export default function App() {
  const [modals, setModals] = useState({
    category: false,
    recordName: false,
    hospitalName: false,
    patientName: false,
    metricName: false,
  });

  const [data, setData] = useState({
    category: [],
    recordName: [],
    hospitalName: [],
    patientName: [],
    metricName: [],
  });

  const baseEndpoint = "https://backend-poc-tsp9.onrender.com/api/";

  const endpoints = {
    category: `${baseEndpoint}categories`,
    recordName: `${baseEndpoint}records`,
    hospitalName: `${baseEndpoint}practices`,
    patientName: `${baseEndpoint}patients`,
    metricName: `${baseEndpoint}metrics`,
  };

  const openModal = (field) => {
    setModals({ ...modals, [field]: true });
  };

  const closeModal = (field) => {
    setModals({ ...modals, [field]: false });
  };

  const handleSubmit = (field, values) => {
    setData({ ...data, [field]: values });
  };

  const handleLogout = () => {
    // Remove token from localStorage and optionally reset the state
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
      window.location.href = '/login';
  };

  return (
    <div className="app-container">
      <h1 className="app-title">SmartSearches 2.0</h1>
      <div className="buttons-container">
        <button className="main-button" onClick={() => openModal("category")}>
          Add KPI Category
        </button>
        <button className="main-button" onClick={() => openModal("recordName")}>
          Add KPI Record Name
        </button>
        <button className="main-button" onClick={() => openModal("hospitalName")}>
          Add Hospital Name
        </button>
        <button className="main-button" onClick={() => openModal("patientName")}>
          Add Patient Name
        </button>
        <button className="main-button" onClick={() => openModal("metricName")}>
          Add Metric Name
        </button>
        {/* Logout button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Display Data */}
      <div className="data-container">
        <h2>Stored Data:</h2>
        <pre className="data-display">{JSON.stringify(data, null, 2)}</pre>
      </div>

      {/* Modals */}
      {Object.keys(modals).map((field) => (
        <InputModal
          key={field}
          isOpen={modals[field]}
          closeModal={() => closeModal(field)}
          title={`Add ${field.charAt(0).toUpperCase() + field.slice(1)}`}
          placeholder={`Enter a ${field}`}
          endpoint={endpoints[field]}
          onSubmit={(values) => handleSubmit(field, values)}
        />
      ))}
    </div>
  );
}
