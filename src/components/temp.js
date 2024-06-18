import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import './FacultyDisplay.css'; // Create a CSS file for styling

const FacultyDisplay = () => {
  const [excelFiles, setExcelFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchExcelFiles();
  }, []);

  const fetchExcelFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_faculty_excel_files');
      setExcelFiles(response.data);
    } catch (error) {
      console.error('Error fetching Excel files:', error);
    }
  };

  const displayExcelData = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_faculty_excel_data/${filename}`, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      ExcelRenderer(blob, (err, resp) => {
        if (err) {
          console.error('Error parsing Excel data:', err);
        } else {
          console.log('Parsed Excel data:', resp);
          
          if (resp && resp.rows && resp.rows.length > 0) {
            setExcelData(resp.rows);
            scrollToTable();
          } else {
            console.error('Invalid response data:', resp);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <h2>Available Excel Files:</h2>
      <div className="file-grid">
        {excelFiles.map((filename, index) => (
          <div key={index} className="file-item" onClick={() => displayExcelData(filename)}>
            <FontAwesomeIcon icon={faFileExcel} size="2x" className="file-icon" />
            <span title={filename}>{filename}</span>
          </div>
        ))}
      </div>
      
      <h2>Parsed Excel Data:</h2>
      <table ref={tableRef}>
        <tbody>
          {excelData && excelData.length > 0 && excelData.map((row, rowIndex) => (
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

export default FacultyDisplay;
