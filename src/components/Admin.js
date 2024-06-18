import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Admin.css';

// Example of using Font Awesome for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [studentFiles, setStudentFiles] = useState([]);
  const [facultyFiles, setFacultyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [classTeacher, setClassTeacher] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModeStudent, setEditModeStudent] = useState(false);

  const history = useHistory();
  const tableRef = useRef(null); // Reference for the table section

  useEffect(() => {
    fetchStudentFiles();
    fetchFacultyFiles();
  }, []);

  const fetchStudentFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_student_excel_files');
      setStudentFiles(response.data);
    } catch (error) {
      console.error('Error fetching student Excel files:', error);
    }
  };

  const fetchFacultyFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_faculty_excel_files');
      setFacultyFiles(response.data);
    } catch (error) {
      console.error('Error fetching faculty Excel files:', error);
    }
  };

  const displayStudentData = async (filename, type) => {
    setLoading(true);
    setSelectedFile(filename);
    setSelectedType(type);
    try {
      const response = await axios.get(`http://localhost:5000/get_${type}_excel_data/${filename}`);
      setLoading(false);
      if (response.data) {
        if (type === 'student') {
          setStudentData(response.data.data);
          setClassTeacher(response.data.class_teacher);
          setRoomNumber(response.data.room_number);
          setFacultyData([]);
          setEditModeStudent(false); // Reset edit mode for student data
        } else if (type === 'faculty') {
          setFacultyData(response.data.data);
          setStudentData([]);
          setClassTeacher('');
          setRoomNumber('');
        }
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(`Error fetching ${type} Excel data:`, error);
    }
  };

  const handleEditStudent = () => {
    setEditModeStudent(true);
  };

  const handleInputChange = (e, rowIndex, cellIndex) => {
    const updatedData = [...studentData];
    updatedData[rowIndex][cellIndex] = e.target.value;
    setStudentData(updatedData);
  };

  const handleSaveChanges = async () => {
    const currentData = studentData;

    try {
      await axios.post(`http://localhost:5000/save_excel_data/${selectedFile}`, {
        data: currentData,
      });
      setEditModeStudent(false);
      alert('Changes saved successfully.');
    } catch (error) {
      console.error('Error saving Excel data:', error);
    }
  };

  useEffect(() => {
    // Scroll to the table section when selectedType or selectedFile changes
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedType, selectedFile]);

  return (
    <div className="admin-container">
      <button className="buttons dash-button" onClick={() => history.push('/main/admininbox')}>
        Go to Dashboard
      </button>

      <div className="files-section">
        <div className="files-grid">
          <div className="student-files">
            <h2>Student Excel Files:</h2>
            <div className="excel-grid">
              {studentFiles.length > 0 ? (
                studentFiles.map((filename, index) => (
                  <div
                    key={index}
                    className={`excel-file-item ${selectedFile === filename ? 'selected' : ''}`}
                    onClick={() => displayStudentData(filename, 'student')}
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="file-icon" />
                    <span className="file-name">{filename}</span>
                  </div>
                ))
              ) : (
                <p>No Student Excel files available</p>
              )}
            </div>
            {selectedType === 'student' && (
              <div ref={tableRef} className={`timetable-container ${editModeStudent ? 'open' : ''}`}>
                <h2>File Name: {selectedFile}</h2>
                <h3>Class Teacher: {classTeacher}</h3>
                <h3>Room Number: {roomNumber}</h3>
                <div className="timetable">
                  <table>
                    <thead>
                      <tr>
                        {studentData.length > 0 &&
                          studentData[0].map((header, headerIndex) => <th key={headerIndex}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'highlighted' : ''}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className={cell ? '' : 'empty'}>
                              {editModeStudent ? (
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => handleInputChange(e, rowIndex + 1, cellIndex)}
                                />
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!editModeStudent && (
                  <button className="buttons edit-button" onClick={handleEditStudent}>
                    Edit
                  </button>
                )}
                {editModeStudent && (
                  <button className="buttons confirm-button" onClick={handleSaveChanges}>
                    Confirm Changes
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="faculty-files">
            <h2>Faculty Excel Files:</h2>
            <div className="excel-grid">
              {facultyFiles.length > 0 ? (
                facultyFiles.map((filename, index) => (
                  <div
                    key={index}
                    className={`excel-file-item ${selectedFile === filename ? 'selected' : ''}`}
                    onClick={() => displayStudentData(filename, 'faculty')}
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="file-icon" />
                    <span className="file-name">{filename}</span>
                  </div>
                ))
              ) : (
                <p>No Faculty Excel files available</p>
              )}
            </div>
            {selectedType === 'faculty' && (
              <div ref={tableRef} className="timetable-container">
                <h2>File Name: {selectedFile}</h2>
                <div className="timetable">
                  <table>
                    <thead>
                      <tr>
                        {facultyData.length > 0 &&
                          facultyData[0].map((header, headerIndex) => <th key={headerIndex}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {facultyData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'highlighted' : ''}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className={cell ? '' : 'empty'}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Admin;
