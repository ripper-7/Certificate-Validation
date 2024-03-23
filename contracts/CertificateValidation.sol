// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CertificateValidation {
    struct Certificate {
        string studentName;
        string courseCompleted;
        uint256 completionDate;
        bool isValidated;
    }

    mapping(address => Certificate) public certificates;

    event CertificateValidated(address indexed studentAddress, string studentName, bool isValidated);

    function validateCertificate(address _studentAddress) public {
        require(certificates[_studentAddress].completionDate != 0, "Certificate does not exist");
        certificates[_studentAddress].isValidated = true;
        emit CertificateValidated(_studentAddress, certificates[_studentAddress].studentName, true);
    }
}
