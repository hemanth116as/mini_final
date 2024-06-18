import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';
import { useLocation, useHistory } from 'react-router-dom';
import './FacultyDisplay.css'; // Ensure this CSS file contains your styles

const FacultyDisplay = () => {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email'); // Extract email from query parameters
  const [classes, setClasses] = useState(new Map());
  const history = useHistory();

  useEffect(() => {
    displayExcelData(email);
  }, [email]);

  const displayExcelData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5003/get_faculty_excel_data/${email}.xlsx`, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      ExcelRenderer(blob, (err, resp) => {
        if (err) {
          console.error('Error parsing Excel data:', err);
          setLoading(false);
        } else {
          if (resp && resp.rows && resp.rows.length > 0) {
            setExcelData(resp.rows);
            processExcelData(resp.rows); // Process data after setting state
            scrollToTable();
          } else {
            console.error('Invalid response data:', resp);
          }
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error fetching Excel data:', error);
      setLoading(false);
    }
  };

  const processExcelData = (rows) => {
    const newClasses = new Map();
    rows.forEach(row => {
      row.forEach(cell => {
        if (typeof cell === 'string') { // Check if cell is a string
          const words = cell.split("_");
          if (words.length === 2) {
            const classKey = words[0];
            const subjectValue = words[1];
            if (newClasses.has(classKey)) {
              if (!newClasses.get(classKey).includes(subjectValue)) {
                newClasses.get(classKey).push(subjectValue);
              }
            } else {
              newClasses.set(classKey, [subjectValue]);
            }
          }
        }
      });
    });
    setClasses(newClasses);
    console.log(newClasses); // Check the result in the console
  };

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckInbox = () => {
    history.push('/main/facdash');
  };

  return (
    <div className="faculty-display-container">
      <h2>Faculty Name: {email}</h2>
      {classes.size > 0 && (
        <div className="classes-subjects-container">
          <h3>Classes and Subjects:</h3>
          <ul>
            {[...classes].map(([classKey, subjects]) => (
              <li key={classKey}>
                <strong>{classKey}:</strong> {subjects.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2>Assigned Schedule:</h2>
      <div className="table-container" ref={tableRef}>
        {loading ? (
          <p>Loading...</p>
        ) : excelData.length > 0 ? (
          <table>
            <thead>
              <tr>
                {excelData[0].map((cell, cellIndex) => (
                  <th key={cellIndex}>{cell}</th>
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
        ) : (
          <p>No data available. Please check if the file exists for the given email.</p>
        )}
      </div>
      <button className="check-inbox-button" style={{width:'10%'}} onClick={handleCheckInbox}>Check Inbox</button>
    </div>
  );
};

export default FacultyDisplay;
