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

  const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileResult = reader.result;
        crypto.subtle
          .digest("SHA-256", fileResult)
          .then((hash) => {
            const sha256result = hex(hash);
            setSha256result(sha256result);
            resolve(sha256result);
          })
          .catch((error) => {
            console.error("Error calculating SHA-256 hash:", error);
            reject(error);
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
    return fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", req)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  const handleGenerateCertificate = async (data) => {
    try {
      setIsLoading(true);
  
      const { studentName, courseName, completionDate, studentEmail } = data;
  
      const response = await fetch("certsamp.pdf");
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];
  
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
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "Certificate.pdf");
  
      const pdfFile = new File([blob], "Certificate.pdf", { type: "application/pdf" });
      const sha256hash = await processFile(pdfFile);
  
      const metadata = {
        studentName,
        courseName,
        completionDate,
        sha256result: sha256hash,
        timestamp: new Date().toISOString(),
      };
  
      try {
        const result = await pinJSONToIPFS(metadata);
        console.log("JSON pinned to IPFS:", result);
      } catch (error) {
        console.error("Error pinning JSON to IPFS:", error);
      }
  
      // Send email with certificate attachment
      const formData = new FormData();
      formData.append("to", studentEmail);
      formData.append("subject", "Congratulations on Your Course Completion!");
      formData.append("html", `
        <h1>Congratulations, ${studentName}!</h1>
        <p>You have successfully completed the course: ${courseName}.</p>
        <p>Completion Date: ${completionDate}</p>
        <p>Your certificate is attached to this email.</p>
      `);
      formData.append("attachments", new Blob([pdfBytes], { type: "application/pdf" }), "Certificate.pdf");
  
      const emailResponse = await fetch("http://localhost:5500/send-email", {
        method: 'POST',
        body: formData,
      });
  
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Failed to send email: ${errorText}`);
      }
      
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error generating or processing certificate:", error);
    } finally {
      setIsLoading(false);
      reset();
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
