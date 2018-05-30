pragma solidity ^0.4.16;

contract Resolution {
    // Variables
    address public owner;
    string public resolutionText;
    uint public totalReward = 0;
    mapping(address => uint) rewards;
    mapping(uint => address) acceptValueToOwner;
    bool[] acceptanceValues;
    address[] rewardCreators;
    // 0: initial, 1: complete, 2: declined
    uint public resolutionStatus = 0;

    // Events
    event AllAccepted();

    function Resolution(string _resolutionText, address _owner) public {
        owner = _owner;
        resolutionText = _resolutionText;
    }

    function CreateReward() payable public returns (bool){
        if(msg.value == 0) return false;

        rewards[msg.sender] = msg.value;
        totalReward += msg.value;

        // Save acceptance value to a dynamic array. We have to be able to tell
        // if every one who have mane reward have accepted the resolution successful.
        uint id = acceptanceValues.push(false) - 1;
        acceptValueToOwner[id] = msg.sender;

        // Save addresses to an array so we can loop it through when returning funds
        rewardCreators.push(msg.sender);

        return true;
    }

    function acceptResolution() public {
        for (uint i = 0; i < acceptanceValues.length; i++) {
            if (acceptValueToOwner[i] == msg.sender) {
                acceptanceValues[i] = true;
            }
        }

        if (_checkIfAllIsAccepted()) {
            emit AllAccepted();
            _sendRewardToOwner();
            resolutionStatus = 1;
        }
    }

    function declineResolution() public {
        // Only people who have made rewards can decline the resolution
        bool addressHaveMadeReward = false;
        for (uint i = 0; i < acceptanceValues.length; i++) {
            if (acceptValueToOwner[i] == msg.sender) {
                addressHaveMadeReward = true;
            }
        }

        assert(addressHaveMadeReward != false);

        // Decline and return funds
        for (uint k = 0; k < rewardCreators.length; k++) {
            _refund(rewardCreators[k]);
        }

        resolutionStatus = 2;
    }

    function _refund(address _returnAddress) private {
        _returnAddress.transfer(rewards[_returnAddress]);
    }

    function _checkIfAllIsAccepted() view private returns(bool) {
        if(acceptanceValues.length == 0) return false;

        bool returnValue = true;

        for (uint i = 0; i < acceptanceValues.length; i++) {
            returnValue = acceptanceValues[i];
        }

        return returnValue;
    }

    function _sendRewardToOwner() private {
        owner.transfer(totalReward);
    }

    function getRewardByAddress(address _address) public view returns(uint) {
        return rewards[_address];
    }

    function getContractBalance() view public returns (uint){
        return address(this).balance;    
    }

    function getIsAccepted() public view returns(bool) {
        return _checkIfAllIsAccepted();
    }


}