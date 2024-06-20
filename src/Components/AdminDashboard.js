import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../App.css';
import { Button } from 'react-bootstrap';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';

function AdminDashboard({ contract }) {
  const JWT = process.env.REACT_APP_JWT
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sha256result, setSha256result] = useState('');

  const processFiles = (files) => {
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileResult = reader.result;
        crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
          const sha256result = hex(hash);
          console.log(sha256result);
          setSha256result(sha256result);
        }).catch((error) => {
          console.error('Error calculating SHA-256 hash:', error);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  function hex(buffer) {
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
  }

  const pinJSONToIPFS = async (json) => {

    const req = {
      method: 'POST',
      headers: {Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json'},
      body: JSON.stringify(json)
      };
      fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', req)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };

  const handleGenerateCertificate = async (data) => {
    try{
      const { studentName, courseName, completionDate } = data;

      // Fetch the existing PDF
      const response = await fetch("certsamp.pdf");
      const existingPdfBytes = await response.arrayBuffer();
      // Load the PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];

      // Set the font size and add the text to the page
      page.drawText(studentName, {
        x: 320,
        y: 345,
        size: 24,
        color: rgb(0, 0, 0),
      });

      page.drawText(courseName, {
        x: 220,
        y: 230,
        size: 24,
        color: rgb(0, 0, 0),
      });

      page.drawText(completionDate, {
        x: 370,
        y: 170,
        size: 18,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const file = new File(
        [pdfBytes],
        "Certificate.pdf",
        {
          type: "application/pdf;charset=utf-8",
        }
      );
      saveAs(file);

      await processFiles([file]);

      const metadata = {
        studentName,
        courseName,
        completionDate,
        sha256result,
        timestamp: new Date().toISOString()

      };

      try {
        const result = await pinJSONToIPFS(metadata);
        console.log('JSON pinned to IPFS:', result);
      } catch (error) {
        console.error('Error pinning JSON to IPFS:', error);
      }
    }catch (error){
      console.error('Error generating or processing certificate:', error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit(handleGenerateCertificate)}>
        <input
          type="text"
          placeholder="Student Name"
          {...register('studentName', { required: true })}
        />
        {errors.studentName && <span>This field is required</span>}

        <input
          type="text"
          placeholder="Course Name"
          {...register('courseName', { required: true })}
        />
        {errors.courseName && <span>This field is required</span>}

        <input
          type="date"
          placeholder="Completion Date"
          {...register('completionDate', { required: true })}
        />
        {errors.completionDate && <span>This field is required</span>}

        <input
          type="email"
          placeholder="Student Email"
          {...register('studentEmail', { required: true })}
        />
        {errors.studentEmail && <span>This field is required</span>}

        <Button type="submit" id="submitBtn">Get Certificate</Button>
      </form>
      <div id="result">
        {sha256result && <p>SHA-256 Hash: {sha256result}</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
