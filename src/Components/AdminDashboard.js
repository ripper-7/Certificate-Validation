import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import "./Home.css";

function AdminDashboard({ contract }) {
  const [nameSize, setNameSize] = useState(0);
  const JWT = process.env.REACT_APP_JWT;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [sha256result, setSha256result] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const processFiles = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileResult = reader.result;
        crypto.subtle
          .digest("SHA-256", fileResult)
          .then((hash) => {
            const sha256result = hex(hash);
            console.log(sha256result);
            setSha256result(sha256result);
          })
          .catch((error) => {
            console.error("Error calculating SHA-256 hash:", error);
          });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  function hex(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
      const value = view.getUint32(i);
      const stringValue = value.toString(16);
      const padding = "00000000";
      const paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }
    return hexCodes.join("");
  }

  const pinJSONToIPFS = async (json) => {
    const req = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    };
    fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", req)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  const handleGenerateCertificate = async (data) => {
    try {
      setIsLoading(true);
  
      // Access form data correctly
      const { studentName, courseName, completionDate } = data;
  
      // Fetch the existing PDF
      const response = await fetch("certsamp.pdf");
      const existingPdfBytes = await response.arrayBuffer();
      // Load the PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];
  
      // Set the font size and add the text to the page
      const encoder = new TextEncoder();
      const studentNameBytes = encoder.encode(studentName);
      const size = studentNameBytes.length;
      setNameSize(size);
      const l = 402 - size * 5;
      page.drawText(`${studentName}`, {
        x: l,
        y: 345,
        size: 24,
        color: rgb(0, 0, 0),
      });
  
      const courseNameBytes = encoder.encode(courseName);
      const size1 = courseNameBytes.length;
      setNameSize(size1);
      const l1 = 402 - size1 * 5;
      page.drawText(`${courseName}`, {
        x: l1,
        y: 230,
        size: 24,
        color: rgb(0, 0, 0),
      });
  
      page.drawText(`${completionDate}`, {
        x: 375,
        y: 170,
        size: 18,
        color: rgb(0, 0, 0),
      });
  
      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      console.log("Done creating");
  
      // Create a Blob from pdfBytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
  
      // Download the saved PDF
      saveAs(blob, "Certificate.pdf");
  
      // Process files (if needed)
      const pdfFile = new File([blob], "Certificate.pdf", { type: "application/pdf" });
      await processFiles([pdfFile]);
  
      // Prepare metadata for pinning to IPFS
      const metadata = {
        studentName,
        courseName,
        completionDate,
        sha256result,
        timestamp: new Date().toISOString(),
      };
  
      // Pin metadata to IPFS
      try {
        const result = await pinJSONToIPFS(metadata);
        console.log("JSON pinned to IPFS:", result);
      } catch (error) {
        console.error("Error pinning JSON to IPFS:", error);
      }
    } catch (error) {
      console.error("Error generating or processing certificate:", error);
    } finally {
      setIsLoading(false);
      reset(); // Reset form after processing
    }
  };
  

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ marginTop: "100px" }}
    >
      <div className="card" style={{ backgroundColor: "rgb(92, 225, 230)" }}>
        <div className="card-head">
          <h2 className="text-center mt-3 px-3">Admin Dashboard</h2>
        </div>
        <hr className="m-0" style={{ color: "rgb(103, 151, 103)" }} />
        <div className="card-body">
          <form onSubmit={handleSubmit(handleGenerateCertificate)}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Student Name"
                {...register("studentName", {
                  required: "Student Name is required",
                })}
              />
              {errors.studentName && (
                <span className="text-danger">
                  {errors.studentName.message}
                </span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Course Name"
                {...register("courseName", {
                  required: "Course Name is required",
                })}
              />
              {errors.courseName && (
                <span className="text-danger">{errors.courseName.message}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                placeholder="Completion Date"
                {...register("completionDate", {
                  required: "Completion Date is required",
                })}
              />
              {errors.completionDate && (
                <span className="text-danger">
                  {errors.completionDate.message}
                </span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Student Email"
                {...register("studentEmail", {
                  required: "Student Email is required",
                })}
              />
              {errors.studentEmail && (
                <span className="text-danger">
                  {errors.studentEmail.message}
                </span>
              )}
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn enter" disabled={isLoading}>
                Get Certificate
              </button>
            </div>
          </form>
        </div>
      </div>
      {sha256result && (
        <div className="alert alert-info mt-5">
          <strong>SHA-256 Hash:</strong>

          <small>{sha256result}</small>
        </div>
      )}
    </div>

  );
}

    
export default AdminDashboard;
