const CertificateUpload = artifacts.require("CertificateUpload");

contract("CertificateUpload", accounts => {
  it("should upload a certificate", async () => {
    const uploadInstance = await CertificateUpload.deployed();
    await uploadInstance.uploadCertificate("John Doe", "Blockchain 101", 1638321600); // Assuming completion date is in Unix timestamp format
    const certificate = await uploadInstance.certificates(accounts[0]);
    assert.equal(certificate.studentName, "John Doe", "Student name is incorrect");
    assert.equal(certificate.courseCompleted, "Blockchain 101", "Course completed is incorrect");
    assert.equal(certificate.completionDate, 1638321600, "Completion date is incorrect");
    assert.equal(certificate.isUploaded, true, "Certificate not uploaded successfully");
  });
});
