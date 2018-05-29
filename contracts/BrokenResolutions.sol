pragma solidity ^0.4.16;
import "./Resolution.sol";

contract BrokenResolutions {
    address[] public resolutions;
    mapping (uint => address) public resolutionToOwner;

    function BrokenResolutions() public {
        
    }

    function createResolution(string _resolutionText) public {
        address newResolution = new Resolution(_resolutionText, msg.sender);
        uint id = resolutions.push(newResolution) - 1;
        resolutionToOwner[id] = msg.sender;
    }

    function getResolutionsCount() external view returns(uint) {
        return resolutions.length;
    }
}