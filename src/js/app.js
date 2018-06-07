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
  $.getJSON('https://s3.eu-central-1.amazonaws.com/broken-resolutions/build/contracts/BrokenResolutions.json', function (data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var CardFactoryArtifact = data;
    App.contracts.CardFactory = TruffleContract(CardFactoryArtifact);

    // Set the provider for our contract
    App.contracts.CardFactory.setProvider(App.web3Provider);

    //App.contracts.CardFactory.deployed().then(function (instance) {
      App.contracts.CardFactory.at('0x179A5729e9faBFE457319F1d655e84713ba31Ba5').then(function (instance) {
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
  checkIfAreRegistered();
}

var checkIfAreRegistered = function () {
  let x = App.deployed.getIsPlayerRegistered.call().then(function (result) {
    if (result === true) {
      setRegisteredElementsVisible(false);

      App.deployed.getPlayerName.call(App.accounts[0]).then(function (result) {
        $('#player_info').text(result + "!");
      });
    } else {
      setRegisteredElementsVisible(true);
      loading(false);
      console.log("NOT registered!");
    }
  });

  getResolutions(); 
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

var getInstanceOfResolution = function (address) {

};

var getResolutions = function () {
  loading(false);
  let x = App.deployed.getResolutions().then(function (result) {
    result.forEach(function (resolution) {
      loading(true);

      $.getJSON('https://s3.eu-central-1.amazonaws.com/broken-resolutions/build/contracts/Resolution.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var ResolutionFactoryArtifact = data;
        App.contracts.Resolution = TruffleContract(ResolutionFactoryArtifact);

        // Set the provider for our contract
        App.contracts.Resolution.setProvider(App.web3Provider);

        App.contracts.Resolution.at(resolution).then(function (instance) {
          //return instance;

          instance.getDetails().then(function (result) {
            let rewardInEth = web3.fromWei(parseFloat(result[1], "ether"));

            resolutions_placeholder.innerHTML += '<tr><td>' + 
            result[0] + '</td><td>' + 
            rewardInEth + ' Ether</td><td>' +
            getStatusBadge(result[2]) + `</td><td>` + 
            result[3] + `</td><td>` +
            result[5] + `/` + result[4] + `</td><td>` +
            `<button class="btn btn-info btn-sm" onclick="openResolution('` + resolution + `')">Show</button>`;
            + `</td></tr>`;

            loading(false);
          });
        });
      });
    });
  });
}

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

var openResolution = function (id) {
  window.location.href = "resolution.html?id=" + id;

};


var loading = function (isLoading) {
  if (isLoading) {
    $("#loader").show(); $("#loader").show();
  } else {
    $("#loader").hide();
  }
}

var mycards = function () {
  window.location.href = "mycards.html";
}

var setRegisteredElementsVisible = function (isRegistered) {
  if (isRegistered) {
    $("#register_placeholder").show();
    $("#registered_placeholder").hide();
  } else {
    $("#register_placeholder").hide();
    $("#registered_placeholder").show();
  }
}

$(document).ready(function () {
  console.log("Init start.");

 initWeb3();
 //getAccounts();
 //loading(false);
  if (getAccounts()) {
    initContract();
    $("#your_address").text(App.accounts[0]);
  } else {
    alert("Check MetaMask account!");
  }


});