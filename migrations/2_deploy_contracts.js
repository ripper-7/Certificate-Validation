const CertificateUpload = artifacts.require("CertificateUpload");
const CertificateValidation = artifacts.require("CertificateValidation");

module.exports = function(deployer) {
  deployer.deploy(CertificateValidation);
};
