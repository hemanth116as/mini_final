import React, { useState } from 'react';
import axios from 'axios';
import './FacultyAvailabilityChecker.css'; // Import your CSS file for styling

const FacultyAvailabilityChecker = () => {
  const [departments, setDepartments] = useState(['CSE', 'CSE-AIML', 'ECE', 'EEE', 'CIVI', 'MECH']);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableFaculty = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5004/get_faculty_availability', {
        params: {
          department: selectedDepartment,
          day: selectedDay,
          time: selectedTime
        }
      });
      setLoading(false);
      setAvailableFaculty(response.data.faculty);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching available faculty:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value.replace(/:/g, ".");
    setSelectedTime(timeValue);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAvailableFaculty();
  };

  return (
    <div className="faculty-availability-checker">
      <h2>Faculty Availability Checker</h2>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="department">Select Department:</label>
          <select id="department" className="select-box" value={selectedDepartment} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="day">Select Day:</label>
          <select id="day" className="select-box" value={selectedDay} onChange={handleDayChange} required>
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="time">Select Time:</label>
          <select id="time" className="select-box" value={selectedTime} onChange={handleTimeChange} required>
            <option value="">Select Time</option>
            <option value="09.00 -10.00">9:00-10:00 AM</option>
            <option value="10.00 -11.00">10:00-11:00 AM</option>
            <option value="11.00 -12.00">11:00-12:00</option>
            <option value="12.00 - 01.00">12:00-1:00</option>
            <option value="01.40-02.40">1:40-2:40</option>
            <option value="02.40-03.40">2:40-3:40</option>
          </select>
        </div>

        <button className="search-button" type="submit">Search</button>
      </form>

      {loading && <p className="loading-text">Loading...</p>}

      <div className="results">
        <h3>Available Faculty:</h3>
        <ul>
          {availableFaculty.map((faculty, index) => (
            <li key={index}>{faculty}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyAvailabilityChecker;
