import React, { useState } from 'react';
import '../App.css';
import { Button } from 'react-bootstrap';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

function AdminDashboard({ contract }) {
  const [studentName, setStudentName] = useState('');
  const [courseCompleted, setCourseCompleted] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleGenerateCertificate = async () => {

      // Fetch the existing PDF
      const response = await fetch("certsamp.pdf");
      const existingPdfBytes = await response.arrayBuffer();
      // Load the PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];


      // Set the font size and add the text to the page
      page.drawText(`${studentName}`, {
        x: 320,
        y: 345, //200
        size: 24,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`${courseCompleted}`, {
        x: 220, //220
        y: 230, //100
        size: 24,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${completionDate}`, {
        x: 370,//220
        y: 170, //50
        size: 18,
        color: rgb(0, 0, 0),
      });
      const pdfBytes = await pdfDoc.save();
      console.log("Done creating");
      

      var file = new File(
        [pdfBytes],
        "Certiicate.pdf",
        {
          type: "application/pdf;charset=utf-8",
        }
      );
     saveAs(file);
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input type="text" placeholder="Course Completed" value={courseCompleted} onChange={(e) => setCourseCompleted(e.target.value)} />
      <input type="date" placeholder="Completion Date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
      <Button onClick={handleGenerateCertificate} id="submitBtn">Get Certificate</Button>
    </div>
  );
}

    
export default AdminDashboard;
