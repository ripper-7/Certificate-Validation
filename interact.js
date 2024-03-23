// interact.js

const CertificateUpload = artifacts.require("CertificateUpload");
const CertificateValidation = artifacts.require("CertificateValidation");

module.exports = async function(callback) {
  try {
    // Get deployed instances of the contracts
    const uploadInstance = await CertificateUpload.deployed();
    const validationInstance = await CertificateValidation.deployed();

    // Interact with the contracts
    // Example: Call a function on CertificateUpload contract
    const uploadResult = await uploadInstance.get();

    console.log("Result of get() function from CertificateUpload contract:", uploadResult);

    // Example: Call a function on CertificateValidation contract
    // const validationResult = await validationInstance.someFunction();

    // console.log("Result of someFunction() from CertificateValidation contract:", validationResult);

    // Add more interactions as needed

    callback(null);
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
