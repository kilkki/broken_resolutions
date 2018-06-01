pragma solidity ^0.4.16;
import "./Resolution.sol";
import "./PlayerService.sol";

contract BrokenResolutions is PlayerService {
    address[] public resolutions;
    mapping (uint => address) public resolutionToOwner;

    // function BrokenResolutions() public {}

    function createResolution(string _resolutionText) public {
        address newResolution = new Resolution(_resolutionText, msg.sender, playerName[msg.sender]);
        uint id = resolutions.push(newResolution) - 1;
        resolutionToOwner[id] = msg.sender;
    }

    function getResolutionsCount() external view returns(uint) {
        return resolutions.length;
    }

    function getResolutions() public view returns (address[]){
        return resolutions;
    }

    function getResolution(uint _index) external view returns(address) {
        return resolutions[_index];
    }
}