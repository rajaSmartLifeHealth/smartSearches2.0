import { useState, useEffect } from "react";

export default function PatientModal({ isOpen, closeModal, endpoint, onSubmit }) {
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newRecord, setNewRecord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // For error handling

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch patients and practices with token authorization
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(""); // Clear any previous errors when re-opening the modal

      Promise.all([
        fetch(`${endpoint}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }).then((res) => res.json()),

        fetch(`${endpoint}/practices`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }).then((res) => res.json()),
      ])
        .then(([patientsData, practicesData]) => {
          setPatients(patientsData);
          setPractices(practicesData);
        })
        .catch((err) => {
          setError("Error fetching data");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, endpoint, token]);

  // Add a new patient with token authorization
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
        Authorization: `Bearer ${token}`, // Add token to headers
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newPatient) => {
        setPatients([...patients, newPatient]);
        setPatientName(""); // Clear the patient name input field
        setSelectedPractice(""); // Reset the selected practice field
        setMedicalRecords([]); // Reset the medical records field
        onSubmit && onSubmit(newPatient); // Call onSubmit if provided
        setError(""); // Clear error if successful
      })
      .catch((err) => {
        setError("Error adding patient.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  // Add a new medical record
  const handleAddRecord = () => {
    if (newRecord) {
      setMedicalRecords([...medicalRecords, newRecord]);
      setNewRecord(""); // Clear the new record input field
    }
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Patients</h2>

        {/* Display error message */}
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
              <li key={index}>{record}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newRecord}
            onChange={(e) => setNewRecord(e.target.value)}
            placeholder="Enter a new record"
            disabled={isLoading}
          />
          <button onClick={handleAddRecord} disabled={isLoading}>
            {isLoading ? "Adding Record..." : "Add Record"}
          </button>
        </div>

        <button onClick={handleAddPatient} disabled={isLoading}>
          {isLoading ? "Adding Patient..." : "Add Patient"}
        </button>

        <ul>
          {patients.map((patient) => (
            <li key={patient._id}>
              {patient.name} ({patient.practice?.name || "No Practice"})
            </li>
          ))}
        </ul>

        <button onClick={closeModal} disabled={isLoading}>
          Close
        </button>
      </div>
    </div>
  ) : null;
}
