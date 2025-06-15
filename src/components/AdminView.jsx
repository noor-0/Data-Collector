import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const AdminView = () => {
  const [students, setStudents] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolList, setSchoolList] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'students'));
        const studentData = querySnapshot.docs.map((doc) => doc.data());

        setStudents(studentData);

        const schools = [...new Set(studentData.map((s) => s.schoolName))];
        setSchoolList(schools);

        if (schools.length > 0 && !selectedSchool) {
          setSelectedSchool(schools[0]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [selectedSchool]);

  const filteredStudents = selectedSchool
    ? students.filter((s) => s.schoolName === selectedSchool)
    : [];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDownload = async () => {
    if (filteredStudents.length === 0) {
      alert('No students to download.');
      return;
    }

    // Prepare Excel data (image URLs as text)
    const dataForExcel = filteredStudents.map(student => ({
      Name: student.name,
      Roll_Number: student.rollNumber,
      Department: student.department,
      Year: student.year,
      Class: student.className,
      Section: student.section,
      School: student.schoolName,
      Image_URL: student.image || 'No Image',
      Timestamp: student.timestamp
        ? new Date(student.timestamp.seconds * 1000).toLocaleString()
        : '',
    }));

    // Create worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create ZIP archive
    const zip = new JSZip();

    // Add Excel file to ZIP
    zip.file(`students-${selectedSchool || 'all'}.xlsx`, excelBuffer);

    // Folder for images inside ZIP
    const imgFolder = zip.folder('student_images');

    // Fetch each image and add to ZIP
    // Filter only students with image URL
    const studentsWithImages = filteredStudents.filter((s) => s.image);

    // Fetch images as blobs and add to zip folder
    await Promise.all(
      studentsWithImages.map(async (student, idx) => {
        try {
          const response = await fetch(student.image);
          if (!response.ok) {
            console.warn(`Failed to fetch image for ${student.name}: ${response.statusText}`);
            return;
          }
          const blob = await response.blob();

          // Extract image file extension from URL or fallback to jpg
          let ext = 'jpg';
          const urlParts = student.image.split('.');
          if (urlParts.length > 1) {
            const lastPart = urlParts[urlParts.length - 1].split('?')[0];
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(lastPart.toLowerCase())) {
              ext = lastPart.toLowerCase();
            }
          }

          // Add image file to zip
          const safeName = student.name.replace(/\s+/g, '_').toLowerCase();
          imgFolder.file(`${safeName}_${idx + 1}.${ext}`, blob);
        } catch (err) {
          console.error('Error fetching image:', err);
        }
      })
    );

    // Generate ZIP and trigger download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `students_data_${selectedSchool || 'all'}.zip`);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-color)',
      }}
      className="backdrop-blur-md shadow-xl rounded-xl p-8 text-left max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>

      {/* School selector */}
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
              Download Student Info & Images
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
                  {student.image && (
                    <img
                      src={student.image}
                      alt={`${student.name}'s profile`}
                      className="mb-2 max-h-24 object-contain rounded"
                    />
                  )}
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
