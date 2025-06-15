import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

import * as XLSX from 'xlsx';

const AdminView = () => {
  const [students, setStudents] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolList, setSchoolList] = useState([]);

  // 🔁 Fetch all students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'students'));
        const studentData = querySnapshot.docs.map((doc) => doc.data());

        setStudents(studentData);

        // Extract unique school names
        const schools = [...new Set(studentData.map((s) => s.schoolName))];
        setSchoolList(schools);

        // Optionally auto-select the first school
        if (schools.length > 0 && !selectedSchool) {
          setSelectedSchool(schools[0]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

 
const handleDownload = () => {
  if (filteredStudents.length === 0) {
    alert('No students to download.');
    return;
  }

  // Prepare data for Excel
  const dataForExcel = filteredStudents.map(student => ({
    Name: student.name,
    Roll_Number: student.rollNumber,
    Department: student.department,
    Year: student.year,
    Class: student.className,
    Section: student.section,
    School: student.schoolName,
    Timestamp: new Date(student.timestamp?.seconds * 1000).toLocaleString(), // Convert Firestore timestamp
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  // Download
  XLSX.writeFile(workbook, `students-${selectedSchool || 'all'}.xlsx`);
};

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // 🧠 Filter students by selected school
  const filteredStudents = selectedSchool
    ? students.filter((s) => s.schoolName === selectedSchool)
    : [];

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-color)',
      }}
      className="backdrop-blur-md shadow-xl rounded-xl p-8 text-left max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>

      {/* 🔽 Select School Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select School:</label>
        <select
          value={selectedSchool}
          onChange={(e) => {
            setSelectedSchool(e.target.value);
            setExpandedIndex(null);
          }}
          style={{
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            borderColor: 'gray',
          }}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">-- Choose a school --</option>
          {schoolList.map((school, index) => (
            <option key={index} value={school}>
              {school}
            </option>
          ))}
        </select>
      </div>

      {/* 👥 Show Students */}
      {selectedSchool && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Students in {selectedSchool}</h3>
            <button
              onClick={handleDownload}
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--button-text)',
              }}
              className="px-4 py-2 rounded text-sm shadow hover:opacity-90 transition"
            >
              Download Student Info
            </button>
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500">No students found for this school.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStudents.map((student, index) => (
                <div
                  key={index}
                  onClick={() => toggleExpand(index)}
                  aria-expanded={expandedIndex === index}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleExpand(index);
                  }}
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    border: '1px solid gray',
                  }}
                  className="p-4 rounded-lg shadow-sm cursor-pointer"
                >
                  <p className="font-semibold mb-2">{student.name}</p>
                  {expandedIndex === index && (
                    <div className="space-y-1 text-sm">
                      <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                      <p><strong>Department:</strong> {student.department}</p>
                      <p><strong>Year:</strong> {student.year}</p>
                      <p><strong>Section:</strong> {student.section}</p>
                      <p><strong>Class:</strong> {student.className}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminView;
