//= require cable
//= require_self
//= require_tree .

$(document).on('turbolinks:load', function() {
  if(isHandshakePath(location.pathname)){
    var pathId = location.pathname.replace( /^\D+/g, '');

    App['challenge' + pathId] = App.cable.subscriptions.create({channel: 'HandshakesChannel', room: pathId}, {
       connected: function() {
        console.log("user connected");
      },

      received: function(data) {
        //take challenger or acceptor from the handshakehelperbroadcastjob and change the background color of the div with that name.
        console.log(data);
        checkHandshakes(pathId, data.handshakes);
        if(data.message == "challenger") {
          var elem = $("#challengerthumbybutton");
          unhideHand(elem);
          // rotateAnimation("thumbupchallenger", 30);
          // bloopOpen($elem);
        } else if (data.message == "acceptor") {
          var elem = $("#acceptorthumbybutton");
          unhideHand(elem);
          // rotateAnimation("thumbupacceptor", 30);
          // bloopOpen(elem);
        }

      },

      setChallengeId: function(challengeId) {
        this.challengeId = challengeId;
      }
    });
    $(window).load(function(){
      var email = $('div.panel-body').attr('data-email');
      // console.log(email)
      App['challenge' + pathId].setChallengeId(pathId);
      App['challenge' + pathId].send();
    })

    // $("#acceptor").addEventListener("click", function() {

    // })

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
    setTimeout(
          function() {
            location.replace("/challenges/" + challenge_id + "/edit");
          }, 5000);
  }
};


function unhideHand(elem){
  elem.removeClass("hidden");
  // elem.fadeIn(1000).fadeOut(1000).fadeIn(1000);
  elem.children().animate({
    height: "toggle",
  }, 1000);
  elem.animate({
      'opacity': '0.5'
  }, 1000, function () {
      elem.css({
          'backgroundColor': '#ff5c59',
          'opacity': '1'
      });
  });
}


function submitNewMessage(){
  var $button = $('a.the-shake-button');
  var $buttonContainer = $button.closest('div');
  if(isWitness(splitCookieString(document.cookie))){
    $('h4').text("Waiting for the Handshake")
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
}


// function bloopOpen(elem) {
//   elem.not(':animated').css({'opacity': 1 }).effect("scale", {origin:['middle','center'], from:{width:elem.width()/2,height:elem.height()/2}, percent: 100, direction: 'both', easing: "easeOutBounce" }, 700);
// }

// var looper;
// var degrees = 90;
// function rotateAnimation(el,speed){
//   var elem = document.getElementById(el);
//   if(navigator.userAgent.match("Chrome")){
//     elem.style.WebkitTransform = "rotate("+degrees+"deg)";
//   } else if(navigator.userAgent.match("Firefox")){
//     elem.style.MozTransform = "rotate("+degrees+"deg)";
//   } else if(navigator.userAgent.match("MSIE")){
//     elem.style.msTransform = "rotate("+degrees+"deg)";
//   } else if(navigator.userAgent.match("Opera")){
//     elem.style.OTransform = "rotate("+degrees+"deg)";
//   } else {
//     elem.style.transform = "rotate("+degrees+"deg)";
//   }
//   looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
//   degrees--;
//   if(degrees == 0){
//     degrees = 90;
//   }
// };

// $("#shakearea").on("click", function() {
//   if(action == 1) {
//     var elem = $("#challenger");
//     unhideHand(elem);
//     rotateAnimation("thumbupchallenger", 30);
//     action++;
//   } else if (action == 2) {
//     var elem = $("#acceptor");
//     unhideHand(elem);
//     rotateAnimation("thumbupacceptor", 30);
//     var button = $("#shakearea");
//     button.hide();
//   }
// })
