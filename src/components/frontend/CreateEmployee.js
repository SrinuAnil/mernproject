import React, { useState } from 'react';
import './CreateEmployee.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    imageFile: '',
    course: [],
    createDate: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateMobile = (mobile) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const validateImage = (fileName) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    return allowedExtensions.exec(fileName);
  };

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) {
      if (!validateImage(file.name)) {
        setError('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setFormData({ ...formData, imageFile: file.name });
    }
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      course: checked
        ? [...prevFormData.course, value]
        : prevFormData.course.filter((course) => course !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, designation, gender, imageFile, course, createDate } = formData;

    if (!name || !email || !mobile || !designation || !gender || !imageFile || !course.length || !createDate) {
      setError('All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!validateMobile(mobile)) {
      setError('Mobile number must be numeric and 10 digits long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/employees-list', formData);
      if (response.status === 201) {
        navigate('/employee-list');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Email already exists');
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="create-employee-container">
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="label-container">
          <label htmlFor="name">Name:</label>
          <div className="input-container">
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="email">Email:</label>
          <div className="input-container">
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="mobile">Mobile Number:</label>
          <div className="input-container">
            <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="designation">Designation:</label>
          <div className="input-container">
            <select id="designation" name="designation" value={formData.designation} onChange={handleChange}>
              <option value="">Select designation</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>
        <div className="label-container">
          <label>Gender:</label>
          <div className="input-container">
            <label>
              <input type="radio" name="gender" value="Male" onChange={handleChange} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" onChange={handleChange} />
              Female
            </label>
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="course">Course:</label>
          <div className="input-container">
            <label>
              <input type="checkbox" name="course" value="MCA" onChange={handleCourseChange} />
              MCA
            </label>
            <label>
              <input type="checkbox" name="course" value="BCA" onChange={handleCourseChange} />
              BCA
            </label>
            <label>
              <input type="checkbox" name="course" value="BSC" onChange={handleCourseChange} />
              BSC
            </label>
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="createDate">Create Date:</label>
          <div className="input-container">
            <input type="date" id="createDate" name="createDate" value={formData.createDate} onChange={handleChange} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="imageFile">Image (JPG, PNG):</label>
          <div className="input-container">
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEmployee;
