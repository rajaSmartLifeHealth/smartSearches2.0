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

  const openModal = (field) => {
    setModals({ ...modals, [field]: true });
  };

  const closeModal = (field) => {
    setModals({ ...modals, [field]: false });
  };

  const handleSubmit = (field, values) => {
    setData({ ...data, [field]: values });
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
      </div>

      {/* Display Data */}
      <div className="data-container">
        <h2>Stored Data:</h2>
        <pre className="data-display">{JSON.stringify(data, null, 2)}</pre>
      </div>

      {/* Modals */}
      <InputModal
        isOpen={modals.category}
        closeModal={() => closeModal("category")}
        title="Add KPI Categories"
        placeholder="Enter a KPI Category"
        onSubmit={(values) => handleSubmit("category", values)}
      />
      <InputModal
        isOpen={modals.recordName}
        closeModal={() => closeModal("recordName")}
        title="Add KPI Record Names"
        placeholder="Enter a KPI Record Name"
        onSubmit={(values) => handleSubmit("recordName", values)}
      />
      <InputModal
        isOpen={modals.hospitalName}
        closeModal={() => closeModal("hospitalName")}
        title="Add Hospital Names"
        placeholder="Enter a Hospital Name"
        onSubmit={(values) => handleSubmit("hospitalName", values)}
      />
      <InputModal
        isOpen={modals.patientName}
        closeModal={() => closeModal("patientName")}
        title="Add Patient Names"
        placeholder="Enter a Patient Name"
        onSubmit={(values) => handleSubmit("patientName", values)}
      />
      <InputModal
        isOpen={modals.metricName}
        closeModal={() => closeModal("metricName")}
        title="Add Metric Names"
        placeholder="Enter a Metric Name"
        onSubmit={(values) => handleSubmit("metricName", values)}
      />
    </div>
  );
}
