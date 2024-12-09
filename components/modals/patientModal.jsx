import { useState, useEffect } from "react";

export default function PatientModal({ isOpen, closeModal, endpoint }) {
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newRecord, setNewRecord] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch patients and practices with token authorization
  useEffect(() => {
    if (isOpen) {
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
        .catch((err) => console.error(err));
    }
  }, [isOpen, endpoint, token]);

  // Add a new patient with token authorization
  const handleAddPatient = () => {
    const payload = {
      name: patientName,
      practice: selectedPractice,
      records: medicalRecords,
    };

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
        setPatientName("");
        setSelectedPractice("");
        setMedicalRecords([]);
      })
      .catch((err) => console.error(err));
  };

  // Add a new medical record
  const handleAddRecord = () => {
    if (newRecord) {
      setMedicalRecords([...medicalRecords, newRecord]);
      setNewRecord("");
    }
  };

  return isOpen ? (
    <div className="modal">
      <h2>Manage Patients</h2>
      <input
        type="text"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter patient name"
      />
      <select
        value={selectedPractice}
        onChange={(e) => setSelectedPractice(e.target.value)}
      >
        <option value="" disabled>
          Select Practice
        </option>
        {practices.map((practice) => (
          <option key={practice._id} value={practice.name}>
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
        />
        <button onClick={handleAddRecord}>Add Record</button>
      </div>
      <button onClick={handleAddPatient}>Add Patient</button>
        <ul>
        {patients.map((patient) => (
          <li key={patient._id}>
            {patient.name} ({patient.practice?.name || 'No Practice'})
          </li>
        ))}
      </ul>

      <button onClick={closeModal}>Close</button>
    </div>
  ) : null;
}
