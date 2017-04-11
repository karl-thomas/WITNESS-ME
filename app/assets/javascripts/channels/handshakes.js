//= require cable
//= require_self
//= require_tree .

$(document).on('ready', function() {
  console.log("hello");
  console.log(location.pathname);
  console.log(window.location.pathname);
  if(isHandshakePath(location.pathname)){
    var pathId = location.pathname.replace( /^\D+/g, '');

    App['challenge' + pathId] = App.cable.subscriptions.create({channel: 'HandshakesChannel', room: pathId}, {
       connected: function() {
        console.log("user connected");
      },

      received: function(data) {
        console.log(data);
        checkHandshakes(pathId, data.handshakes);
          $("[data-challenge='" + this.challengeId + "']").css("background-color", "green");
          return $("[data-challenge='" + this.challengeId + "']").append(data.message);
      },

      setChallengeId: function(challengeId) {
        this.challengeId = challengeId;
      }
    });
    $(window).load(function(){
      var email = $('div.panel-body').attr('data-email');
      console.log(email)
      App['challenge' + pathId].setChallengeId(pathId);
      App['challenge' + pathId].send();
    })
    submitNewMessage();
  }
});

function splitCookieString(cookies){
  return cookies.split(" ");
};

function isWitness(cookieArray){
  var regexedArray = [];
  cookieArray.forEach(function(cookie){
    var matched = cookie.match(/.*=(.*)/)[1];
    regexedArray.push(matched.replace(";",''));
  });
  return(regexedArray[0] === regexedArray[1]);
}

function isHandshakePath(path){
  return (path.match(/^\D+/) == "/handshakes/");
};

function checkHandshakes(challenge_id, shooken) {
  if(shooken >= 2){
    return location.replace("/challenges/" + challenge_id + "/edit");
  }
};

function submitNewMessage(){
  var $button = $('a.the-shake-button');
  var $buttonContainer = $button.closest('div');
  if(isWitness(splitCookieString(document.cookie))){
    $buttonContainer.append("let your friends shake");
    $button.remove();
  }
  else {
    $button.on('click', function(event) {
      var idOfChallengeRoom = $buttonContainer.attr('data-challenge');
      $button.hide();
      App['challenge' + idOfChallengeRoom].setChallengeId(idOfChallengeRoom);
      App['challenge' + idOfChallengeRoom].send({message: idOfChallengeRoom});

      return false;
    });
  }
};
