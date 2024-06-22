import React, { useState } from 'react';
import '../App.css';
import { Button } from 'react-bootstrap';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

function AdminDashboard({ contract }) {
  const [studentName, setStudentName] = useState('');
  const [courseCompleted, setCourseCompleted] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [sha256result, setSha256result] = useState('');
  const [nameSize, setNameSize] = useState(0);

  const processFiles = (files) => {
    Array.from(files).forEach((file, index) => {
        //console.log(file,"Processing File")
        const reader = new FileReader();
        reader.onload = () => {
            const fileResult = reader.result;
            crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
                const sha256result = hex(hash);
                console.log(sha256result);
                setSha256result(sha256result);
          // You can use the hash result as needed (e.g., send to server, update state, etc.)
        }).catch((error) => {
          console.error('Error calculating SHA-256 hash:', error);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  function hex(buffer){
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
        var value = view.getUint32(i);
        var stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
    }
    return hexCodes.join('');
  };
  
  const handleGenerateCertificate = async () => 
  {
      // Fetch the existing PDF
      const response = await fetch("certsamp.pdf");
      const existingPdfBytes = await response.arrayBuffer();
      // Load the PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];
      //console.log((studentName).size())

      const encoder = new TextEncoder();
      const studentNameBytes = encoder.encode(studentName);
      const size = studentNameBytes.length;
      setNameSize(size);
      const l=(402-(size*5))
      // Set the font size and add the text to the page
      page.drawText(`${studentName}`, {
        x: l,
        y: 345, //200
        size: 24,
        color: rgb(0, 0, 0),
      });
      const courseNameBytes=encoder.encode(courseCompleted);
      const size1=courseNameBytes.length;
      setNameSize(size1);
      const l1=(402-(size1*5))
      page.drawText(`${courseCompleted}`, {
        x: l1, //220
        y: 230, //100
        size: 24,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${completionDate}`, {
        x: 375,//220
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
      saveAs(file)
      const pdfFile = new File([file], "Certificate.pdf", { type: "application/pdf" });
      processFiles([pdfFile]);
  };


  

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input type="text" placeholder="Course Completed" value={courseCompleted} onChange={(e) => setCourseCompleted(e.target.value)} />
      <input type="date" placeholder="Completion Date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
      <Button onClick={handleGenerateCertificate} id="submitBtn">Get Certificate</Button>
      <div id="result">
        {sha256result && <p>SHA-256 Hash: {sha256result}</p>}
      </div>
    </div>

  );
}

    
export default AdminDashboard;
