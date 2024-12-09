import { useState, useEffect } from "react";

export default function MetricModal({ isOpen, closeModal, endpoint }) {
  const [metrics, setMetrics] = useState([]);
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch patients and metrics
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');

      // Fetch metrics and patients data concurrently with Authorization header
      Promise.all([
        fetch(`${endpoint}/metrics`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to headers for authorization
          }
        }).then((res) => res.json()),

        fetch(`${endpoint}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to headers for authorization
          }
        }).then((res) => res.json()),
      ])
        .then(([metricsData, patientsData]) => {
          setMetrics(metricsData);
          setPatients(patientsData);
          console.log("Fetched patients:", patientsData);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint]);

  // Add a new metric
  const handleAddMetric = () => {
    const payload = {
      name: metricName,
      value: metricValue,
      patient: selectedPatient,
    };

    const token = localStorage.getItem('authToken');
    
    // Make the POST request with Authorization header
    fetch(`${endpoint}/metrics`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Add token to headers for authorization
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newMetric) => {
        setMetrics([...metrics, newMetric]);  // Add the new metric to the metrics list
        setMetricName("");  // Clear the metric name input field
        setMetricValue("");  // Clear the metric value input field
        setSelectedPatient("");  // Reset the selected patient field
      })
      .catch((err) => console.error("Error adding metric:", err));
  };

  // Function to get the patient's name by ID
  const getPatientNameById = (patientId) => {
    const patient = patients.find((p) => p._id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  return isOpen ? (
    <div className="modal">
      <h2>Manage Metrics</h2>
      <input
        type="text"
        value={metricName}
        onChange={(e) => setMetricName(e.target.value)}
        placeholder="Enter metric name"
      />
      <input
        type="number"
        value={metricValue}
        onChange={(e) => setMetricValue(e.target.value)}
        placeholder="Enter metric value"
      />
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
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
      <button onClick={handleAddMetric}>Add Metric</button>
      {isLoading ? (
        <p>Loading...</p>  // Show loading text while data is being fetched
      ) : (
        <ul>
          {metrics.map((metric) => (
            <li key={metric._id}>
              {metric.name}: {metric.value} (Patient: {getPatientNameById(metric.patient)})
            </li>
          ))}
        </ul>
      )}
      <button onClick={closeModal}>Close</button>
    </div>
  ) : null;
}
