// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateGenerator {
    struct Certificate {
        string studentName;
        string courseCompleted;
        uint256 completionDate;
        address generatedBy;
        bool exists;
    }

    mapping(address => Certificate) public certificates;

    event CertificateGenerated(address indexed studentAddress, string studentName, string courseCompleted, uint256 completionDate, address indexed generatedBy);

    modifier onlyAdmin {
        // Replace this with your admin verification logic
        require(msg.sender == adminAddress, "Only admin can perform this action");
        _;
    }

    address public adminAddress;

    constructor() {
        adminAddress = msg.sender; // Set the contract deployer as the admin
    }

    function generateCertificate(address _studentAddress, string memory _studentName, string memory _courseCompleted, uint256 _completionDate) public onlyAdmin {
        require(!certificates[_studentAddress].exists, "Certificate already generated");

        certificates[_studentAddress] = Certificate(_studentName, _courseCompleted, _completionDate, msg.sender, true);
        emit CertificateGenerated(_studentAddress, _studentName, _courseCompleted, _completionDate, msg.sender);
    }
}

contract CertificateValidator {
    struct Certificate {
        string studentName;
        string courseCompleted;
        uint256 completionDate;
        address generatedBy;
        bool exists;
        bool isValidated;
    }

    mapping(address => Certificate) public certificates;

    event CertificateValidated(address indexed studentAddress, string studentName, bool isValidated);

    function validateCertificate(address _studentAddress) public {
        require(certificates[_studentAddress].exists, "Certificate does not exist");
        require(!certificates[_studentAddress].isValidated, "Certificate already validated");
        certificates[_studentAddress].isValidated = true;
        emit CertificateValidated(_studentAddress, certificates[_studentAddress].studentName, true);
    }
}
