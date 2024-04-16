//import React, { useState } from 'react';

import React from 'react';
import '../App.css';
function UserDashboard() {
    const handleFiles = (event) => {
        const files = event.target.files; // Access the selected files from the input event
        if (files.length > 0) {
            // Call the handleFiles function to process the selected files
            processFiles(files);
        }
    };

    const processFiles = (files) => {
        Object.keys(files).forEach((item, index) => {
            const file = files[index];
            const reader = new FileReader();

            reader.onload = () => {
                const fileResult = reader.result;
                
                crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
                    var sha256result = hex(hash);
                    console.log(sha256result);
                    document.getElementById('result').innerHTML = sha256result;
                    // You can use the hash result as needed (e.g., send to server, update state, etc.)
                }).catch((error) => {
                    console.error('Error calculating SHA-256 hash:', error);
                });
            };

            reader.readAsArrayBuffer(file);
        });
    };

    function hex(buffer){
        var hexCodes = [];
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
            var value = view.getUint32(i);
            var stringValue = value.toString(16);
            const padding = '00000000';
            const paddedValue = (padding + stringValue).slice(-padding.length);
            hexCodes.push(paddedValue);
        }
        return hexCodes.join('');
    };

    return (
    
        <div className='container'>
            <label>
                <input type="file" onChange={handleFiles} />
                
                <p id="result">No image selected</p>
            </label>
        </div>
    );
}

export default UserDashboard;







/*--------------------------------------------------------------------------------------------------------------

function UserDashboard({ contract }) {
  //const [certificateOwner, setCertificateOwner] = useState('');
  //const [isValidated, setIsValidated] = useState(false);

  /*
  const handleValidateCertificate = async () => {
    // Call the smart contract function to validate certificate

    await contract.methods.validateCertificate(certificateOwner).send({ /*from:  User's Ethereum address */ /*});
    setIsValidated(true);
    alert('Certificate validated!');
  };
  */
/*
  function handleFiles(files) {
    console.log(files[0]);
    // files will be an array of files, even if only one file is selected  
    Object.keys(files).forEach((item, index) => {
      const file = files[index];
      // start a new instance of FileReader
      const reader = new FileReader();
  
      // provide an onload callback for this instance of FileReader
      // this is called once reader.readAsArrayBuffer() is done
      reader.onload = () => {
        const fileResult = reader.result;
        
        crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
          var sha256result = hex(hash);
          // this should contain your sha-256 hash value
          console.log(sha256result);
          document.getElementById('result').innerHTML = sha256result;
        });
      };
  
      // calling reader.readAsArrayBuffer and providing a file should trigger the callback above 
      // as soon as readAsArrayBuffer is complete
      reader.readAsArrayBuffer(file);
    });
    
  }

  function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
      // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
      var value = view.getUint32(i)
      // toString(16) will give the hex representation of the number without padding
      var stringValue = value.toString(16)
      // We use concatenation and slice for padding
      var padding = '00000000'
      var paddedValue = (padding + stringValue).slice(-padding.length)
      hexCodes.push(paddedValue);
    }
  
    // Join all the hex strings into one
    return hexCodes.join("");
  }
    



  return (

    <div>
      <h2>User Dashboard</h2>

      <input type="file" onchange={handleFiles(this.files)}><span title="Select file"></span>
        <div>
          <p id="result">No image selected</p>
        </div>
        </input>
   */ 

/*
      <input type="text" placeholder="Certificate Owner's Address" value={certificateOwner} onChange={(e) => setCertificateOwner(e.target.value)} />
      {isValidated ? (
        <p>Certificate is validated</p>
      ) : (
        <button onClick=handleFiles>Validate Certificate</button>
      )}

    *//*}
    </div>

  );
}

export default UserDashboard;

-----------------------------------------------------------------------------------------------------------------------------------------------------*/


/*






// Description:
// There is a simple html filepicker, which is used to select local files on your machine (the objective is 
// to test with images, but this should work for any files).
//
// The `handleFiles` function takes the selected files, and iterates through them, generating a sha256 hash from each image
//
// The logic to create the hash was taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
//
// This uses WebCryptography SubtleCrypto, its compatibility can be seen here https://caniuse.com/#feat=cryptography
//
//

// Resources: 
//  SubtleCrypto.digest()
//  https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
//  -----------


handleFiles = (files) => {
  console.log(files[0]);
  // files will be an array of files, even if only one file is selected  
  Object.keys(files).forEach((item, index) => {
    const file = files[index];
    // start a new instance of FileReader
    const reader = new FileReader();

    // provide an onload callback for this instance of FileReader
    // this is called once reader.readAsArrayBuffer() is done
    reader.onload = () => {
      const fileResult = reader.result;
      
      crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
        var sha256result = hex(hash);
        // this should contain your sha-256 hash value
        console.log(sha256result);
        document.getElementById('result').innerHTML = sha256result;
      });
    };

    // calling reader.readAsArrayBuffer and providing a file should trigger the callback above 
    // as soon as readAsArrayBuffer is complete
    reader.readAsArrayBuffer(file);
  });
  
}
  

// this function was taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

*/