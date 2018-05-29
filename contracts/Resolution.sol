pragma solidity ^0.4.16;

contract Resolution {
    address public owner;
    string public resolutionText;
    mapping(address => uint) rewards;

    function Resolution(string _resolutionText, address _owner) public {
        owner = _owner;
        resolutionText = _resolutionText;
    }
}