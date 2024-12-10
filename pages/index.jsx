import { useState } from "react";
import CategoryModal from "../components/modals/categoryModal";
import RecordModal from "../components/modals/recordModal";
import PracticeModal from "../components/modals/practiceModal";
import PatientModal from "../components/modals/patientModal";
import MetricModal from "../components/modals/metricModal";
import KpiDashboard from "../components/KpiDashboard"; 

export default function App() {
  const steps = [
    "category",
    "record",
    "practice",
    "patient",
    "metric",
  ]; 
  const [currentStep, setCurrentStep] = useState(null); 
  const [showDashboard, setShowDashboard] = useState(false); 

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
    }); 
    setCurrentStep(0); // Start 
    setShowDashboard(false); // 
  };

  const handleSubmit = (field, values) => {
    // Ensure values is an array, even if it's a single value (non-iterable)
    const valuesArray = Array.isArray(values) ? values : [values];

    setData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field] || []), ...valuesArray], // Ensure prevData[field] is an array
    }));

    // Move to the next step
    const nextStep = steps.indexOf(field) + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);  // Go to next step after submitting
    } else {
      // If it's the last step, move to dashboard
      console.log("Finished all steps, showing dashboard.");
      setShowDashboard(true);
      setCurrentStep(null); // Reset current step to null to indicate completion
    }
  };

  

  const closeModal = () => {
    // Automatically move to the next step after closing the modal
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);  // Move to the next step
    } else {
      setShowDashboard(true); // If the last step, show the dashboard
      setCurrentStep(null); // End the process
    }
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
            closeModal={closeModal}
            endpoint={baseEndpoint}
            onSubmit={(values) => handleSubmit("category", values)}
          />
          )}
          {currentStep === 1 && (
            <RecordModal
              isOpen={currentStep === 1}
              closeModal={closeModal} 
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("record", values)}
            />
          )}
          {currentStep === 2 && (
            <PracticeModal
              isOpen={currentStep === 2}
              closeModal={closeModal} 
              endpoint={baseEndpoint}
              onSubmit={(values) => handleSubmit("practice", values)}
            />
          )}
          {currentStep === 3 && (
            <PatientModal
              isOpen={currentStep === 3}
              closeModal={closeModal} 
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
          disabled={currentStep !== null} 
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