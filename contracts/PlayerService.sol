pragma solidity ^0.4.21;
import "./PlayerService.sol";

contract PlayerService {
    mapping (address => string) public playerName;
    mapping (address => uint) public playerId;
    mapping (uint => address) public playerIdToAddress;
    address[] public players;

    function register(string _name) public {	
        playerId[msg.sender] = players.length;
        playerIdToAddress[players.length] = msg.sender;
        players.push(msg.sender);
        playerName[msg.sender] = _name;        
    }

    function getIsPlayerRegistered() public view returns (bool) {
        bool isRegistered = false;

        for (uint i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                isRegistered = true;
                }
            }
            
        return isRegistered;
    }

    function getPlayerName(address _playerAddress) public view returns(string) {
        return playerName[_playerAddress];
    }

    // Retrieving the players
    function getPlayers() public view returns (address[]) {
        return players;
    }
}