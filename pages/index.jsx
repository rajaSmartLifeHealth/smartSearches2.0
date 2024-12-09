import { useState } from "react";
import CategoryModal from "../components/modals/categoryModal";
import RecordModal from "../components/modals/recordModal";
import PracticeModal from "../components/modals/practiceModal";
import PatientModal from "../components/modals/patientModal";
import MetricModal from "../components/modals/metricModal";
import KpiDashboard from "../components/KpiDashboard"; // Import KPI Dashboard

export default function App() {
  const steps = [
    "category",
    "recordName",
    "hospitalName",
    "patientName",
    "metricName",
  ]; // Define the order of steps
  const [currentStep, setCurrentStep] = useState(0); 
  const [showDashboard, setShowDashboard] = useState(false); // Toggle KPI Dashboard

  const [data, setData] = useState({
    category: [],
    recordName: [],
    hospitalName: [],
    patientName: [],
    metricName: [],
  });

  const baseEndpoint = "https://backend-poc-tsp9.onrender.com/api";

  const startNewKpi = () => {
    setCurrentStep(0);
    setShowDashboard(false); 
  };

  const handleSubmit = (field, values) => {
    // Save the data for the current step
    setData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ...values],
    }));

    // Move to the next step if not at the last step
    const nextStep = steps.indexOf(field) + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep); // Go to the next modal
    } else {
      setCurrentStep(null); 
      setShowDashboard(true); 
    }
  };

  const closeModal = () => {
    setCurrentStep(null); // Close the current modal
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
    window.location.href = "/login";
  };

  return (
    <div className="app-container">
      <h1 className="app-title">SmartSearches 2.0</h1>

      {/* Start New KPI or Show Dashboard */}
      {!currentStep && !showDashboard && (
        <div className="start-options">
          <button className="main-button" onClick={startNewKpi}>
            Start New KPI
          </button>
          <button
            className="view-dashboard-button"
            onClick={() => setShowDashboard(true)}
          >
            View Dashboard
          </button>
        </div>
      )}

      {/* Show KPI Dashboard */}
      {showDashboard && (
        <>
          <KpiDashboard data={data} />
          <button
            className="back-button"
            onClick={() => setShowDashboard(false)}
          >
            Back to Start
          </button>
        </>
      )}

      {/* Workflow Steps */}
      {!showDashboard && currentStep !== null && (
        <>
          <div className="workflow-instructions">
            <p>
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].charAt(0).toUpperCase() +
                steps[currentStep].slice(1)}
            </p>
          </div>

          {/* Modals */}
          {currentStep === 0 && (
            <CategoryModal
              isOpen={currentStep === 0}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("category", values)}
            />
          )}
          {currentStep === 1 && (
            <RecordModal
              isOpen={currentStep === 1}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("recordName", values)}
            />
          )}
          {currentStep === 2 && (
            <PracticeModal
              isOpen={currentStep === 2}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("hospitalName", values)}
            />
          )}
          {currentStep === 3 && (
            <PatientModal
              isOpen={currentStep === 3}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("patientName", values)}
            />
          )}
          {currentStep === 4 && (
            <MetricModal
              isOpen={currentStep === 4}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("metricName", values)}
            />
          )}

          {/* Show KPI Dashboard Button */}
          <button
            className="view-dashboard-button"
            onClick={() => setShowDashboard(true)}
          >
            View KPI Dashboard
          </button>
        </>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
