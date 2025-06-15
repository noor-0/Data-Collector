import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig"; // adjust path as needed


// Common inline styles
const inputStyle = {
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-color)',
  border: '1px solid gray',
};

const buttonStyle = {
  backgroundColor: 'var(--button-bg)',
  color: 'var(--button-text)',
};

/**
 * StepForm: Handles rendering input fields and navigation buttons
 * for the current step in the multi-step form.
 */
const StepForm = ({
  step,
  schoolName, setSchoolName,
  className, setClassName,
  section, setSection,
  student, handleStudentChange,
  setStep, handleSubmit
}) => {
  switch (step) {
    case 1:
      return (
        <div className="flex flex-col gap-4">
          <label>School Name</label>
          <input
            type="text"
            style={inputStyle}
            className="w-full px-4 py-2 rounded-md"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button
              disabled={!schoolName}
              style={buttonStyle}
              className="px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col gap-4">
          <label>Class</label>
          <input
            type="text"
            style={inputStyle}
            className="w-full px-4 py-2 rounded-md"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} style={buttonStyle} className="px-4 py-2 rounded">
              Back
            </button>
            <button
              disabled={!className}
              style={buttonStyle}
              className="px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col gap-4">
          <label>Section</label>
          <input
            type="text"
            style={inputStyle}
            className="w-full px-4 py-2 rounded-md"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} style={buttonStyle} className="px-4 py-2 rounded">
              Back
            </button>
            <button
              disabled={!section}
              style={buttonStyle}
              className="px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        </div>
      );

    case 4:
      return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Student details fields */}
          {['name', 'rollNumber', 'department', 'year'].map((field) => (
            <div key={field}>
              <label>{field[0].toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                style={inputStyle}
                className="w-full px-4 py-2 rounded-md"
                value={student[field]}
                onChange={handleStudentChange}
                required
              />
            </div>
          ))}

          {/* File input for student image */}
          <label>Student Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleStudentChange}
            style={{ color: 'var(--text-color)' }}
          />

          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => setStep(3)} style={buttonStyle} className="px-4 py-2 rounded">
              Back
            </button>
            <button type="submit" style={buttonStyle} className="px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </form>
      );

    default:
      return null;
  }
};

/**
 * ClientView: Multi-step form to collect student details including school,
 * class, section, and individual student information.
 */
const ClientView = ({ onAddStudent }) => {
  const [step, setStep] = useState(1); // Current step
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [student, setStudent] = useState({
    name: '',
    rollNumber: '',
    department: '',
    year: '',
    image: null,
  });

  // Handles both text and file changes for student object
  const handleStudentChange = ({ target: { name, value, files } }) => {
    setStudent((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  // Handles form submission (add actual logic as needed)

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addDoc(collection(firestore, "students"), {
      schoolName,
      className,
      section,
      ...student,
      image: student.image ? student.image.name : null, // Or image URL if uploaded
      timestamp: new Date(),
    });

    alert("Student data saved to Firestore!");
    // reset form or redirect if needed
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    alert("Failed to save student data.");
  }
};

  return (
    <div
      className="backdrop-blur-md shadow-xl rounded-xl p-8 text-left max-w-2xl mx-auto"
      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add Student Details</h2>

      {/* Step progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-blue-600 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 font-medium" style={{ color: 'var(--text-color)' }}>
          <span>School</span>
          <span>Class</span>
          <span>Section</span>
          <span>Student</span>
        </div>
      </div>

      {/* Render the current step form */}
      <StepForm
        step={step}
        schoolName={schoolName}
        setSchoolName={setSchoolName}
        className={className}
        setClassName={setClassName}
        section={section}
        setSection={setSection}
        student={student}
        handleStudentChange={handleStudentChange}
        setStep={setStep}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ClientView;
