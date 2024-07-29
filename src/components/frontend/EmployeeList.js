import React, { useState, useEffect } from 'react';
import './EmployeeList.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3001/employees');
        const data = response.data.map(employee => ({
          ...employee,
          course: Array.isArray(employee.course) ? employee.course : JSON.parse(employee.course),
        }));
        setEmployees(data);
      } catch (error) {
        console.error('There was an error fetching the employee data!', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3001/employees/${id}`);
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('There was an error deleting the employee!', error);
      }
    }
  };

  const filteredEmployees = employees.filter(employee =>
    Object.values(employee).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="employee-list">
      <div className="header">
        <h2>Employee List</h2>
        <div className="actions">
          <p>Total Count: {filteredEmployees.length}</p>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <Link to="/create-employee" className="create-employee-button">
            Create Employee
          </Link>
        </div>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td><img src={employee.image} alt={employee.name} className="employee-image" /></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course.join(',')}</td>
                <td>{employee.date}</td>
                <td>
                  <Link to={`/edit-employee/${employee.id}`} className="edit-button">Edit</Link>
                  <p onClick={() => handleDelete(employee.id)} className="delete-button">Delete</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
