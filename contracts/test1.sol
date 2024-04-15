// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract test1 {
    string public hello = "welcome";

    //constructor (){}

    // function hellofunc () public view returns (string memory)
    // {
    //     return hello;
    // }

    uint256 a;

    function setter(uint256 _a) public {
        a = _a;
    }

    function getter() public view returns (uint256) {
        return a;
    }
}