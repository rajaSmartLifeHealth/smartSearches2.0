import { useState, useEffect } from "react";

export default function PatientModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newRecord, setNewRecord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError("");
      setPatientName("");
      setSelectedPractice("");
      setMedicalRecords([]);

      // Fetch patients and practices data
      Promise.all([
        fetch(`${endpoint}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch(`${endpoint}/practices`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ])
        .then(([patientsData, practicesData]) => {
          setPatients(patientsData);
          setPractices(practicesData);
        })
        .catch((err) => {
          setError("Error fetching data.");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

  const handleAddPatient = () => {
    if (!patientName.trim() || !selectedPractice || medicalRecords.length === 0) {
      setError("Please fill all fields.");
      return;
    }

    const payload = {
      name: patientName,
      practice: selectedPractice,
      records: medicalRecords,
    };

    setIsLoading(true);

    fetch(`${endpoint}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newPatient) => {
        setPatients((prev) => [...prev, newPatient]);
        setPatientName("");
        setSelectedPractice("");
        setMedicalRecords([]);
        setError("");
        if (onSubmit) onSubmit(newPatient);
      })
      .catch((err) => {
        setError("Error adding patient.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddRecord = () => {
    if (newRecord.trim()) {
      setMedicalRecords((prev) => [...prev, newRecord.trim()]);
      setNewRecord("");
    }
  };

  const handleRemoveRecord = (index) => {
    setMedicalRecords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setPatientName("");
    setSelectedPractice("");
    setMedicalRecords([]);
    setNewRecord("");
    setError("");
    closeModal();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Patients</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient name"
          disabled={isLoading}
        />
        <select
          value={selectedPractice}
          onChange={(e) => setSelectedPractice(e.target.value)}
          disabled={isLoading}
        >
          <option value="" disabled>
            Select Practice
          </option>
          {practices.map((practice) => (
            <option key={practice._id} value={practice._id}>
              {practice.name}
            </option>
          ))}
        </select>

        <div>
          <h3>Medical Records</h3>
          <ul>
            {medicalRecords.map((record, index) => (
              <li key={index}>
                {record}{" "}
                <button
                  onClick={() => handleRemoveRecord(index)}
                  disabled={isLoading}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newRecord}
            onChange={(e) => setNewRecord(e.target.value)}
            placeholder="Enter a new record"
            disabled={isLoading}
          />
          <button onClick={handleAddRecord} disabled={isLoading || !newRecord.trim()}>
            Add Record
          </button>
        </div>

        <button onClick={handleAddPatient} disabled={isLoading}>
          {isLoading ? "Adding Patient..." : "Add Patient"}
        </button>

        <ul>
          {patients.map((patient) => (
            <li key={patient._id}>
              {patient.name} ({practices.find((p) => p._id === patient.practice)?.name || "No Practice"})
            </li>
          ))}
        </ul>

        <button onClick={handleClose} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
