var BrokenResolutions = artifacts.require("./BrokenResolutions.sol");
var Resolution = artifacts.require("./Resolution.sol");

module.exports = function(deployer) {
   deployer.deploy(BrokenResolutions);
   // deployer.deploy(Resolution);
};
