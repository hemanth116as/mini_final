import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Timetable.css"; // Ensure this CSS file contains your styles for Timetable

// Example of using Font Awesome for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const ExcelDisplay = () => {
  const [excelFiles, setExcelFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [classTeacher, setClassTeacher] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExcelFiles();
  }, []);

  const fetchExcelFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5005/get_excel_files');
      setExcelFiles(response.data);
    } catch (error) {
      console.error('Error fetching Excel files:', error);
    }
  };

  const displayExcelData = async (filename) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5005/get_excel_data/${filename}`);
      setLoading(false);
      if (response.data && response.data.data) {
        setExcelData(response.data.data);
        setClassTeacher(response.data.class_teacher);
        setRoomNumber(response.data.room_number);
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching Excel data:', error);
    }
  };

  // Function to render table headers and body
  const renderTable = () => {
    if (excelData.length === 0) {
      return <p>No Excel data to display</p>;
    }

    // Extract headers from the first row of excelData
    const headers = excelData[0];

    // Render the table headers and body
    return (
      <div className="table-wrapper">
        <table className="wonderful-table">
          <caption>Excel Data</caption>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="excel-display-container">
      <h2>Available Excel Files:</h2>
      <div className="excel-grid">
        {excelFiles.length > 0 ? (
          excelFiles.map((filename, index) => (
            <div key={index} className="excel-file-item" onClick={() => displayExcelData(filename)}>
              <FontAwesomeIcon icon={faFileExcel} className="file-icon" />
              <span className="file-name">{filename}</span>
            </div>
          ))
        ) : (
          <p>No Excel files available</p>
        )}
      </div>

      {loading && <p>Loading...</p>}


      <h2>Parsed Excel Data:</h2>
      {renderTable()}
    </div>
  );
};

export default ExcelDisplay;
