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
    "record",
    "practice",
    "patient",
    "metric",
  ]; // Define the order of steps
  const [currentStep, setCurrentStep] = useState(null); 
  const [showDashboard, setShowDashboard] = useState(false); // Toggle KPI Dashboard

  const [data, setData] = useState({
    category: [],
    record: [],
    practice: [],
    patient: [],
    metric: [],
  });

  const baseEndpoint = "https://backend-poc-tsp9.onrender.com/api";

  const startNewKpi = () => {
    setData({
      category: [],
      record: [],
      practice: [],
      patient: [],
      metric: [],
    }); // Reset the data to clear any previous KPI entries
    setCurrentStep(0); // Start from category
    setShowDashboard(false); // Hide the dashboard
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
      setShowDashboard(true); // Show the KPI Dashboard when all steps are completed
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
              onSubmit={(values) => handleSubmit("record", values)}
            />
          )}
          {currentStep === 2 && (
            <PracticeModal
              isOpen={currentStep === 2}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("practice", values)}
            />
          )}
          {currentStep === 3 && (
            <PatientModal
              isOpen={currentStep === 3}
              closeModal={closeModal} // Allow closing modal
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("patient", values)}
            />
          )}
          {currentStep === 4 && (
            <MetricModal
              isOpen={currentStep === 4}
              closeModal={closeModal} 
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("metric", values)}
            />
          )}

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
