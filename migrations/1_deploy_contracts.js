const CertificateUpload = artifacts.require("CertificateUpload");

module.exports = function(deployer) {
    deployer.deploy(CertificateUpload);
  };