App = {
    web3Provider: null,
    contracts: {},
    cardInstance: null,
    deployed: null,
    accounts: [],
    instance: null,
  }
  
  var initWeb3 = function () {
    loading(true);
  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
  };
  
  var initContract = function () {
    var address = GetURLParameter("id");

    $.getJSON('Resolution.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BrokenResolutionArtifact = data;
      App.contracts.BrokenResolution = TruffleContract(BrokenResolutionArtifact);
  
      // Set the provider for our contract
      App.contracts.BrokenResolution.setProvider(App.web3Provider);
  
      App.contracts.BrokenResolution.at(address).then(function (instance) {
        return instance;
      }).then(function (instance) {
        App.deployed = instance;
        www3Ready();
      });
    });
  };
  
  var getAccounts = function () {
    App.accounts = web3.eth.accounts;
    if (App.accounts.length == 1) {
      return true;
    } else {
      return false
    }
  }
  
  var www3Ready = function () {
    loading(false);
    console.log("Init ready.");
    App.deployed.getDetails().then(function (result) {
        var totalRewardInEth =  web3.fromWei(parseFloat(result[1], "ether"));
        resolutions_placeholder.innerHTML += '<tr><td>' + result[0] + '</td><td>' + totalRewardInEth + ' ether</td><td>' +
        getStatusBadge(result[2]) + `</td><td>` +
        result[3] + `</td><td>` + 
        result[5] + `/` + result[4] + `</td><td>` +        
        `</td><td><tr>`;    
    });

    var getStatusBadge = function(status) {
        let returnValue = "";
      
        if (status == 1) {
          returnValue = `<span class="badge badge-success">Success</span>`;
        }
        if (status == 0) {
          returnValue = `<span class="badge badge-primary">Open</span>`;
        }
        if (status == 2) {
          returnValue = `<span class="badge badge-warning">Rejected</span>`;
        }
      
        return returnValue;
      }
    
    App.deployed.getAddressHaveMadeReward().then(function (result) {    
        $('#btnCreateReward').show();
    
        if (result == true) {
            $('#btnAcceptResolution').show();
            $('#btnDeclineResolution').show();

            App.deployed.getDetails().then(function (result) {        
                if (result[2] == 1 || result[2] == 2) {
                    hideAcceptButtonVisible();
                }
        
                if (result[2] == 0) {
                    console.log(" open");
                    $('#btnCreateReward').show();
                }
            });
        }
    });
  }

  var back = function () {
    window.location.href = "index.html";
  }

  var setAcceptButtonVisible = function() {    
    $('#btnAcceptResolution').show();
    $('#btnDeclineResolution').show();
    
  }

  var hideAcceptButtonVisible = function() {    
    $('#btnAcceptResolution').hide();
    $('#btnDeclineResolution').hide();
    $('#btnCreateReward').hide();
  }

  var acceptResolution = function() {
    App.deployed.acceptResolution().then(function (result) {
        location.reload();
    });
  }

  var declineResolution = function() {
    App.deployed.declineResolution().then(function (result) {
        location.reload();
    });
  }
  
  var GetURLParameter = function (sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  var createReward = function() {
    var rewardValue = web3.toWei(parseFloat($("#createRewardInput").val(), "ether"));
    
    // Check value is numeric
    if (rewardValue == 0) {
        alert('Invalid value!');
        return;
    }

    App.deployed.CreateReward({value: rewardValue}).then(function (result) {
        location.reload();
    });
  }
  
  var loading = function (isLoading) {
    if (isLoading) {
      $("#loader").show();
    } else {
      $("#loader").hide();
    }
  }
  
  var back = function () {
    window.location.href = "index.html";
  }
  
  $(document).ready(function () {
    console.log("Init start.");
    $("#user_has_registered_element").hide();
    $("#register_element").hide();
    initWeb3();
  
    if (getAccounts()) {
      initContract();
    } else {
      alert("Check MetaMask account!");
    }
  
  });