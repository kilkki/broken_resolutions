var BrokenResolutions = artifacts.require("./BrokenResolutions.sol");

contract('BrokenResolutions', async (accounts) => {
    it("Should create a resolution", async () => {
        let instance = await BrokenResolutions.deployed();

        await instance.createResolution("I will do more tests for now on.",{ from: accounts[0] });
   
        let x = await instance.getResolutionsCount();
        assert.equal(x, 1);
    });
});