import React, { useState, useEffect } from "react";
import axios from "axios";
import TreeViewComponent from "./treeViewComponent"; // Import the reusable component

export default function KpiDashboard() {
  const [data, setData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseEndpoint = "https://backend-poc-tsp9.onrender.com/api/";

  // Helper function for API calls
  const fetchData = async (endpoint) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(endpoint, config);

      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      return [];
    }
  };

  // Initial data fetch for categories
  useEffect(() => {
    (async () => {
      const categories = await fetchData(`${baseEndpoint}categories`);
      setData(categories);
      setCurrentData(categories);
    })();
  }, []);

  // Handle tree item click
  const handleItemClick = async (item) => {
    let endpoint;
    let newData = [];

    if (breadcrumbs.length === 0) {
      // Fetch records for the selected category
      endpoint = `${baseEndpoint}records?categoryId=${item._id}`;
      newData = await fetchData(endpoint);
    } else if (breadcrumbs.length === 1) {
      // Fetch practices for the selected record
      endpoint = `${baseEndpoint}practices?recordId=${item._id}`;
      newData = await fetchData(endpoint);
    } else if (breadcrumbs.length === 2) {
      // Fetch hospitals for the selected practice
      endpoint = `${baseEndpoint}patients?practiceId=${item._id}`;
      newData = await fetchData(endpoint);
    } else if (breadcrumbs.length === 3) {
      // Fetch patients and metrics for the selected hospital
      endpoint = `${baseEndpoint}metrics?patientId=${item._id}`;
      newData = await fetchData(endpoint);
    }

    setBreadcrumbs([...breadcrumbs, item]);
    setCurrentData(newData);
  };

  // Handle back navigation
  const handleBack = () => {
    if (breadcrumbs.length === 0) return;

    const updatedBreadcrumbs = [...breadcrumbs];
    updatedBreadcrumbs.pop();
    setBreadcrumbs(updatedBreadcrumbs);

    if (updatedBreadcrumbs.length === 0) {
      setCurrentData(data); // Back to categories
    } else {
      // Fetch previous data
      const previousItem = updatedBreadcrumbs[updatedBreadcrumbs.length - 1];
      handleItemClick(previousItem, true);
    }
  };

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => (
    <div className="breadcrumbs">
      <button onClick={handleBack}>Back</button>
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {crumb.name} {index < breadcrumbs.length - 1 && ">"}
        </span>
      ))}
    </div>
  );

  // Render Metrics Table
  const renderMetricsTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Metric Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((metric, index) => (
            <tr key={index}>
              <td>{metric.patientName}</td>
              <td>{metric.metricName}</td>
              <td>{metric.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="kpi-dashboard">
      <h1>KPI Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {breadcrumbs.length > 0 && renderBreadcrumbs()}
          {currentData && currentData.length > 0 && currentData[0].patientName ? (
            // Render the metrics table when data contains metrics
            renderMetricsTable()
          ) : (
            <TreeViewComponent
              data={currentData}
              labelKey="name"
              onItemClick={handleItemClick}
            />
          )}
        </>
      )}
    </div>
  );
}
