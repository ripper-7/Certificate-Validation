import React, { useState } from 'react';
import '../App.css';

function UserDashboard() {
    const [sha256result, setSha256result] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [error, setError] = useState('');

    const handleFiles = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setError('');
            processFiles(files);
        } else {
            setError('Please select a file.');
        }
    };

    const processFiles = (files) => {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                const fileResult = reader.result;
                
                crypto.subtle.digest('SHA-256', fileResult)
                    .then((hash) => {
                        const sha256result = hex(hash);
                        console.log('Generated SHA-256 hash:', sha256result);
                        setSha256result(sha256result);
                        fetchFileDetails(sha256result);
                    })
                    .catch((error) => {
                        console.error('Error calculating SHA-256 hash:', error);
                        setError('Failed to calculate hash. Please try again.');
                    });
            };

            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                setError('Failed to read file. Please try again.');
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const fetchFileDetails = async (sha256result) => {
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${process.env.REACT_APP_JWT}` },
        };

        try {
            const response = await fetch('https://api.pinata.cloud/data/pinList', options);
            const data = await response.json();
            
            const fetchFilePromises = data.rows.map(row => 
                fetch(`https://gateway.pinata.cloud/ipfs/${row.ipfs_pin_hash}`)
                .then(res => res.json())
                .catch(err => {
                    console.error('Failed to fetch IPFS file:', err);
                    return null; 
                })
            );
            
            const filesDetails = await Promise.all(fetchFilePromises);
            
            let isVerified = false;
            
            filesDetails.forEach(fileDetail => {
                if (fileDetail && fileDetail.sha256result === sha256result) {
                    isVerified = true;
                }
                console.log('File details:', fileDetail);
            });

            setVerificationResult(isVerified ? 'Certificate is verified.' : 'Certificate verification failed.');
            setVerificationStatus(isVerified ? 'info' : 'danger'); 
        } catch (err) {
            console.error('Failed to fetch file details:', err);
            setError('Failed to fetch file details. Please try again.');
        }
    };

    function hex(buffer) {
        const hexCodes = [];
        const view = new DataView(buffer);
        for (let i = 0; i < view.byteLength; i += 4) {
            const value = view.getUint32(i);
            const stringValue = value.toString(16);
            const padding = '00000000';
            const paddedValue = (padding + stringValue).slice(-padding.length);
            hexCodes.push(paddedValue);
        }
        return hexCodes.join('');
    }

    return (
        <div className="d-flex flex-column align-items-center" style={{ marginTop: "200px" }}>
            <div className="card" style={{ backgroundColor: "rgb(92, 225, 230)", width: "400px" }}>
                <div className="card-head">
                    <h2 className="text-center mt-2 px-3">User Dashboard</h2>
                </div>
                <hr className="m-0" style={{ color: "rgb(103, 151, 103)" }} />
                <div className="card-body">
                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleFiles}
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
            </div>
            {sha256result && (
                <div className="alert alert-info mt-5">
                    <strong>SHA-256 Hash: </strong>
                    <small>{sha256result}</small>
                </div>
            )}
            {verificationResult && (
                <div className={`alert alert-${verificationStatus} mt-3`}>
                    <strong>Verification Result: </strong>
                    <small>{verificationResult}</small>
                </div>
            )}
        </div>
    );
}

export default UserDashboard;
