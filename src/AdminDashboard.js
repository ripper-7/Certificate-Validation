import React, { useState } from 'react';
import './App.css';
function AdminDashboard({ contract }) {
  const [studentAddress, setStudentAddress] = useState('');
  const [studentName, setStudentName] = useState('');
  const [courseCompleted, setCourseCompleted] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const handleGenerateCertificate = async () => {
    // Call the smart contract function to upload certificate
    await contract.methods.uploadCertificate(studentAddress, studentName, courseCompleted, completionDate).send({ /* from: Admin's Ethereum address */ });
    alert('Certificate generated and added to blockchain!');
  };
 
  return (
    <div class="container">
      <h2>Admin Dashboard</h2>
      <input type="text" placeholder="Student Address" value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} />
      <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input type="text" placeholder="Course Completed" value={courseCompleted} onChange={(e) => setCourseCompleted(e.target.value)} />
      <input type="date" placeholder="Completion Date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
      <button onClick={handleGenerateCertificate}>Generate Certificate</button>
    </div>
  );
}

export default AdminDashboard;
