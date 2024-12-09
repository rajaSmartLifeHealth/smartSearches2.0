import { useState, useEffect } from "react";

export default function MetricModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [metrics, setMetrics] = useState([]);
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // For error handling

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear any previous errors when modal is opened

      // Fetch metrics and patients data concurrently with Authorization header
      Promise.all([
        fetch(`${endpoint}/metrics`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authorization
          },
        }).then((res) => res.json()),

        fetch(`${endpoint}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authorization
          },
        }).then((res) => res.json()),
      ])
        .then(([metricsData, patientsData]) => {
          setMetrics(metricsData);
          setPatients(patientsData);
        })
        .catch((err) => {
          setError("Error fetching data");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

  // Add a new metric
  const handleAddMetric = () => {
    if (!metricName.trim() || !metricValue.trim() || !selectedPatient) {
      setError("Please fill all fields.");
      return;
    }

    const payload = {
      name: metricName,
      value: metricValue,
      patient: selectedPatient,
    };

    setIsLoading(true);

    // Make the POST request with Authorization header
    fetch(`${endpoint}/metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token to headers for authorization
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newMetric) => {
        setMetrics([...metrics, newMetric]); // Add the new metric to the list
        setMetricName(""); // Clear the metric name input field
        setMetricValue(""); // Clear the metric value input field
        setSelectedPatient(""); // Reset the selected patient field
        onSubmit && onSubmit(newMetric); // Call onSubmit if provided
        setError(""); // Clear error if successful
      })
      .catch((err) => {
        setError("Error adding metric");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  // Function to get the patient's name by ID
  const getPatientNameById = (patientId) => {
    const patient = patients.find((p) => p._id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Metrics</h2>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          value={metricName}
          onChange={(e) => setMetricName(e.target.value)}
          placeholder="Enter metric name"
          disabled={isLoading}
        />
        <input
          type="number"
          value={metricValue}
          onChange={(e) => setMetricValue(e.target.value)}
          placeholder="Enter metric value"
          disabled={isLoading}
        />
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          disabled={isLoading}
        >
          <option value="" disabled>
            Select Patient
          </option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddMetric} disabled={isLoading}>
          {isLoading ? "Adding Metric..." : "Add Metric"}
        </button>

        {isLoading ? (
          <p>Loading...</p> // Show loading text while data is being fetched
        ) : (
          <ul>
            {metrics.map((metric) => (
              <li key={metric._id}>
                {metric.name}: {metric.value} (Patient: {getPatientNameById(metric.patient)})
              </li>
            ))}
          </ul>
        )}

        <button onClick={closeModal} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
