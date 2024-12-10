import { useState, useEffect } from "react";

export default function MetricModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [metrics, setMetrics] = useState([]);
  const [metricName, setMetricName] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear error message when modal opens
      setMetricName(""); // Reset input fields
      setMetricValue("");
      setSelectedPatient("");

      // Fetch metrics and patients data in parallel
      Promise.all([
        fetch(`${endpoint}/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch(`${endpoint}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ])
        .then(([metricsData, patientsData]) => {
          setMetrics(metricsData);
          setPatients(patientsData);
        })
        .catch((err) => {
          setError("Error fetching data.");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

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

    fetch(`${endpoint}/metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newMetric) => {
        setMetrics((prev) => [...prev, newMetric]);
        setMetricName("");
        setMetricValue("");
        setSelectedPatient("");
        setError("");
        if (onSubmit) onSubmit(newMetric); // Notify parent component
      })
      .catch((err) => {
        setError("Error adding metric.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const getPatientNameById = (patientId) => {
    const patient = patients.find((p) => p._id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const handleClose = () => {
    setMetricName("");
    setMetricValue("");
    setSelectedPatient("");
    setError("");
    closeModal();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Metrics</h2>

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
          <p>Loading...</p>
        ) : (
          <ul>
            {metrics.map((metric) => (
              <li key={metric._id}>
                {metric.name}: {metric.value} (Patient: {getPatientNameById(metric.patient)})
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleClose} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
