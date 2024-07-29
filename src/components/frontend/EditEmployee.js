import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateEmployee.css';

const EditEmployee = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState([]);
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [error, setError] = useState('');
  const [isImageUpdated, setIsImageUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/edit-employee/${id}`);
        const responseData = response.data;
        setName(responseData.name);
        setEmail(responseData.email);
        setMobile(responseData.mobile);
        setDesignation(responseData.designation);
        setGender(responseData.gender);
        setCourse(Array.isArray(responseData.course) ? responseData.course : JSON.parse(responseData.course)); // Ensure course is an array
        setDate(responseData.date);
        setImageFile(responseData.image);
      } catch (error) {
        console.error('There was an error fetching the employee data!', error);
      }
    };
    fetchEmployee();
  }, [id]);
  

  const handleFileChange = (e) => {
    setError('');
    setIsImageUpdated(true);
    const file = e.target.files[0].name;
    if (file) {
      setImageFile(file);
    }
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setCourse((prevSelectedCourses) =>
      checked
        ? [...prevSelectedCourses, value]
        : prevSelectedCourses.filter(course => course !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const courseArray = Array.isArray(course) ? course : [];
  
    try {
      await axios.put(`http://localhost:3001/employees/${id}`, { name, email, mobile, designation, gender, course: courseArray, date, imageFile });
      navigate('/employee-list');
    } catch (err) {
      console.error('There was an error!', err);
      setError(err.response?.data || 'Something went wrong');
    }
  };

  return (
    <div className="create-employee-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="label-container">
          <label htmlFor="name">Name:</label>
          <div className="input-container">
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="email">Email:</label>
          <div className="input-container">
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="mobile">Mobile Number:</label>
          <div className="input-container">
            <input type="tel" id="mobile" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="designation">Designation:</label>
          <div className="input-container">
            <select id="designation" name="designation" value={designation} onChange={(e) => setDesignation(e.target.value)}>
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
              <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} />
              Female
            </label>
          </div>
        </div>
        <div className="label-container">
          <label>Course:</label>
          <div className="input-container">
            <label>
              <input type="checkbox" name="course" value="MCA" onChange={handleCourseChange} checked={course.includes('MCA')} />
              MCA
            </label>
            <label>
              <input type="checkbox" name="course" value="BCA" onChange={handleCourseChange} checked={course.includes('BCA')} />
              BCA
            </label>
            <label>
              <input type="checkbox" name="course" value="BSC" onChange={handleCourseChange} checked={course.includes('BSC')} />
              BSC
            </label>
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="date">Create Date:</label>
          <div className="input-container">
            <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="label-container">
          <label htmlFor="imageFile">Image (JPG, PNG):</label>
          <div className="input-container">
            <input type="file" id="imageFile" name="imageFile" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
            {!isImageUpdated && imageFile}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
