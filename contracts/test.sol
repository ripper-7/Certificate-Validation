// SPDX-License-Identifier: MIT 
// Specifies the license for your contract, which allows others to know the terms of use.

pragma solidity ^0.8.17; 
// Specifies the minimum Solidity compiler version this contract will work with.

contract HelloWorld { 
    // Defines the smart contract named "HelloWorld"

    string public greeting = "Hello World!";
    // Declares a string state variable called "greeting" and initializes it.

    function sayHelloWorld() public view returns (string memory) {
        // Defines a function that returns the value of the "greeting" variable.
        return greeting;
    }
}