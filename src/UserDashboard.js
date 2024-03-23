import React, { useState } from 'react';

function UserDashboard({ contract }) {
  const [certificateOwner, setCertificateOwner] = useState('');
  const [isValidated, setIsValidated] = useState(false);

  const handleValidateCertificate = async () => {
    // Call the smart contract function to validate certificate
    await contract.methods.validateCertificate(certificateOwner).send({ /*from:  User's Ethereum address */ });
    setIsValidated(true);
    alert('Certificate validated!');
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <input type="text" placeholder="Certificate Owner's Address" value={certificateOwner} onChange={(e) => setCertificateOwner(e.target.value)} />
      {isValidated ? (
        <p>Certificate is validated</p>
      ) : (
        <button onClick={handleValidateCertificate}>Validate Certificate</button>
      )}
    </div>
  );
}

export default UserDashboard;
