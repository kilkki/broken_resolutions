var BrokenResolutions = artifacts.require("./BrokenResolutions.sol");
var Resolution = artifacts.require("./Resolution.sol");


contract('BrokenResolutions', async (accounts) => {
    it("Should create a resolution and complete it", async () => {
        let instance = await BrokenResolutions.deployed();

        // Register
        await instance.register('User 1', { from: accounts[0] });

        // Create a new resolution
        await instance.createResolution("I will write more tests for now on.",{ from: accounts[0] });

        // Assert resolution was created
        let resolutionCount = await instance.getResolutionsCount();
        assert.equal(resolutionCount, 1);

        // Get instance of the resolution
        let resolution1Address = await instance.getResolution(0);        
        let resolution1Instance = await Resolution.at(resolution1Address);

        // Create rewards
        await resolution1Instance.CreateReward({ from: accounts[1], value: web3.toWei(0.5, "ether") });
        await resolution1Instance.CreateReward({ from: accounts[2], value: web3.toWei(0.15, "ether") });
        await resolution1Instance.CreateReward({ from: accounts[3], value: web3.toWei(0.35, "ether") });

        // Create 2 rewards from one address
        await resolution1Instance.CreateReward({ from: accounts[3], value: web3.toWei(0.35, "ether") });        
        
        // Check the total balance of resolution contract is 1
        let totalBalance = web3.fromWei(parseFloat(await resolution1Instance.getContractBalance.call()), "ether");
        assert.equal(totalBalance, 1.35);

        // Check rewards are stored correctly for each user
        let reward_by_address1 = await resolution1Instance.getRewardByAddress(accounts[1]);
        let reward_by_address2 = await resolution1Instance.getRewardByAddress(accounts[2]);
        let reward_by_address3 = await resolution1Instance.getRewardByAddress(accounts[3]);
        assert.equal( web3.fromWei(parseFloat(reward_by_address1), "ether"), 0.5);
        assert.equal( web3.fromWei(parseFloat(reward_by_address2), "ether"), 0.15);
        assert.equal( web3.fromWei(parseFloat(reward_by_address3), "ether"), 0.35);
        
        // Check total reward
        let totalReward = await resolution1Instance.totalReward.call();
        assert.equal(1.35, web3.fromWei(parseFloat(totalReward), "ether"));

        // Save balance of account1 before reward is received
        let account1Balance = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[0]), "ether"));

        // Accept one by one and check all is accepted when all are
        assert.equal(await resolution1Instance.getIsAccepted.call(), false);
        await resolution1Instance.acceptResolution({ from: accounts[1] });
        assert.equal(await resolution1Instance.getIsAccepted.call(), false);
        await resolution1Instance.acceptResolution({ from: accounts[2] });
        assert.equal(await resolution1Instance.getIsAccepted.call(), false);

        // Assert the event is emitted
        let acceptResponse = await resolution1Instance.acceptResolution({ from: accounts[3] });
        assert.equal(acceptResponse.logs[0].event, "AllAccepted", 'AllAccepted event should fire.');

        // Check resolution is accepted
        assert.equal(await resolution1Instance.getIsAccepted.call(), true);

        // Check reward is received by account who made the resolution
        let finalBalance = web3.fromWei(parseFloat(await resolution1Instance.getContractBalance.call()), "ether");
        assert.equal(finalBalance , 0);

        // Check reward is received to account1
        let account1FinalBalance = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[0]), "ether"));
        assert.equal(account1Balance + 1.35, account1FinalBalance);

        // Check resolution status is complete
        assert.equal(1, await resolution1Instance.resolutionStatus.call());
    });


    it("Should create a resolution and decline it", async () => {
        let instance = await BrokenResolutions.deployed();

        // Register
        await instance.register('User 4', { from: accounts[4] });

        // Create a new resolution
        await instance.createResolution("I will stop doing stupid things!",{ from: accounts[4] });
   
        // Assert resolution was created
        let resolutionCount = await instance.getResolutionsCount();
        assert.equal(parseInt(resolutionCount), 2);

        // Get instance of the resolution
        let resolution1Address = await instance.getResolution(1);        
        let resolution1Instance = await Resolution.at(resolution1Address);

        // Create rewards
        await resolution1Instance.CreateReward({ from: accounts[5], value: web3.toWei(0.68, "ether") });
        await resolution1Instance.CreateReward({ from: accounts[6], value: web3.toWei(0.02, "ether") });
        await resolution1Instance.CreateReward({ from: accounts[7], value: web3.toWei(0.3, "ether") });
        
        // Check the total balance of resolution contract is 1
        let totalBalance = web3.fromWei(parseFloat(await resolution1Instance.getContractBalance.call()), "ether");
        assert.equal(totalBalance , 1);

        // Check rewards are stored correctly for each user
        let reward_by_address1 = await resolution1Instance.getRewardByAddress(accounts[5]);
        let reward_by_address2 = await resolution1Instance.getRewardByAddress(accounts[6]);
        let reward_by_address3 = await resolution1Instance.getRewardByAddress(accounts[7]);
        assert.equal( web3.fromWei(parseFloat(reward_by_address1), "ether"), 0.68);
        assert.equal( web3.fromWei(parseFloat(reward_by_address2), "ether"), 0.02);
        assert.equal( web3.fromWei(parseFloat(reward_by_address3), "ether"), 0.3);
        
        // Check total reward
        let totalReward = await resolution1Instance.totalReward.call();
        assert.equal(1, web3.fromWei(parseFloat(totalReward), "ether"));

        // Accept one by one and check all is accepted when all are
        assert.equal(await resolution1Instance.getIsAccepted.call(), false);
        await resolution1Instance.acceptResolution({ from: accounts[5] });

        let account5Balance = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[5]), "ether"));
        let account6Balance = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[6]), "ether"));
    
        // Decline resolution
        await resolution1Instance.declineResolution({ from: accounts[7] });
        
        // Check all funds are returned
        let account5BalanceFinal = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[5]), "ether"));
        let account6BalanceFinal = parseFloat(web3.fromWei(web3.eth.getBalance(accounts[6]), "ether"));


        assert.equal((account5Balance + 0.68).toPrecision(5), account5BalanceFinal.toPrecision(5));
        assert.equal((account6Balance + 0.02).toPrecision(5), account6BalanceFinal.toPrecision(5));        

        // Check resolution status is declined
        assert.equal(2, await resolution1Instance.resolutionStatus.call());

        // Check the final balance of resolution contract is 0
        let finalBalance = web3.fromWei(parseFloat(await resolution1Instance.getContractBalance.call()), "ether");
        assert.equal(finalBalance , 0);
    });

    it("Test resolution details", async () => {
        let instance = await BrokenResolutions.deployed();

        let resolutionText = "I never drink again!";

        // Create a new resolution
        await instance.createResolution(resolutionText,{ from: accounts[4] });
   
        // Assert resolution was created
        let resolutionCount = await instance.getResolutionsCount();
        assert.equal(parseInt(resolutionCount), 3);

        // Get instance of the resolution
        let resolution1Address = await instance.getResolution(2);        
        let resolution1Instance = await Resolution.at(resolution1Address);

        // Create rewards
        await resolution1Instance.CreateReward({ from: accounts[5], value: web3.toWei(0.68, "ether") });

        // Check details are correct
        let detailsData = await resolution1Instance.getDetails.call();
        assert.equal(resolutionText, detailsData[0]);
        assert.equal(0.68, web3.fromWei(parseFloat(detailsData[1])));
        assert.equal(0, parseInt(detailsData[2]));
        assert.equal("User 4", detailsData[3]);

    });


});