const CertificateUpload = artifacts.require("CertificateUpload");
const CertificateValidation = artifacts.require("CertificateValidation");

contract("CertificateValidation", accounts => {
  it("should validate a certificate", async () => {
    const uploadInstance = await CertificateUpload.deployed();
    await uploadInstance.uploadCertificate("John Doe", "Blockchain 101", 1638321600); // Upload a certificate
    const validationInstance = await CertificateValidation.deployed();
    await validationInstance.validateCertificate(accounts[0]); // Validate the uploaded certificate
    const certificate = await validationInstance.certificates(accounts[0]);
    assert.equal(certificate.isValidated, true, "Certificate not validated successfully");
  });
});
        