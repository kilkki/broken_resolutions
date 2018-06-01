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
    var CardFactoryArtifact = data;
    App.contracts.CardFactory = TruffleContract(CardFactoryArtifact);

    // Set the provider for our contract
    App.contracts.CardFactory.setProvider(App.web3Provider);

    App.contracts.CardFactory.deployed().then(function (instance) {
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

// var register = function () {
//   console.log("register");

//   App.contracts.CardFactory.deployed().then(function (instance) {
//     cardFactoryInstance = instance;

//     console.log("Register player");
//     var name = $("#nameInput").val();
//     cardFactoryInstance.register(name).then(function (result) {      
//       $('#registerModal').modal('hide');
//       setRegisteredElementsVisible(true);

//     });
//   })
// }



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

  // App.deployed.getPlayers.call().then(function (result) {

  //   result.forEach(function (player) {
  //     if (player != App.accounts[0]) {
  //       App.deployed.playerId(player).then(function (result) {
  //         var playerId = result;

  //         App.deployed.getPlayerName.call(player).then(function (result) {
  //           var opponentName = result;
  //           other_players.innerHTML += '<tr><td>' + opponentName + '</td><td><span class="badge badge-success">' + cardCount + '</span></td><td>' +
  //             `<button class="btn btn-info btn-sm" onclick="playWith(` + playerId + `,'` + opponentName + `')">Play with</button></td></tr>`;

  //         });
  //       });
  //     }
  //   });
  // });
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
  let x = App.deployed.getResolutions().then(function (result) {
    result.forEach(function (resolution) {
      console.log(resolution);

      $.getJSON('Resolution.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var ResolutionFactoryArtifact = data;
        App.contracts.Resolution = TruffleContract(ResolutionFactoryArtifact);

        // Set the provider for our contract
        App.contracts.Resolution.setProvider(App.web3Provider);

        App.contracts.Resolution.at(resolution).then(function (instance) {
          //return instance;

          instance.getDetails().then(function (result) {
            console.log(result);

            resolutions_placeholder.innerHTML += '<tr><td>' + result[0] + '</td><td>' + result[1] + '</td><td>' +
            result[2] + `</td><td>` + result[3] + `</td><td>` +
            `<button class="btn btn-info btn-sm" onclick="openResolution('` + resolution + `')">Show</button>`;
            + `</td></tr>`;

            loading(false);


            // `<button class="btn btn-info btn-sm" onclick="playWith(` + playerId + `,'` + opponentName + `')">Play with</button></td></tr>`;


            // resolutions_placeholder.innerHTML +=
            //   `<div class="row">
            //   <div class="col-sm"><p>I promise: ` +
            //   result[0] + `</p><p> Total reward: ` +

            //   result[1] + `</p><p> Status: ` +
            //   result[2] + `</p> <p>Who poor bastard said this: ` +
            //   result[3]
            //   + `</p></div>
            // </div>`
          });
        });
      });



    });
  });
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

  if (getAccounts()) {
    initContract();
    $("#your_address").text(App.accounts[0]);
  } else {
    alert("Check MetaMask account!");
  }


});