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
    $.getJSON('BrokenResolutions.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BrokenResolutionsArtifact = data;
      App.contracts.BrokenResolutions = TruffleContract(BrokenResolutionsArtifact);
  
      // Set the provider for our contract
      App.contracts.BrokenResolutions.setProvider(App.web3Provider);
  
      App.contracts.BrokenResolutions.deployed().then(function (instance) {
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
  
  var createResolution = function () {
    console.log("createResolution");
    loading(true);

  
    App.contracts.BrokenResolutions.deployed().then(function (instance) {
      resolutionInstance = instance;
  
      var text = $("#resolutionTextInput").val();
      resolutionInstance.createResolution(text).then(function (result) {
        loading(false);
        back();
      });
    })
  }
  
  var back = function () {
    window.location.href = "index.html";
  }

  var www3Ready = function () {
    loading(false);
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
  
    console.log("Init ready.");
  });