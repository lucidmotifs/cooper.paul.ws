// Custom Events
var updatestate = jQuery.Event( "updatestate" );

let answered = Array();
let correct = Array();
let incorrect = Array();
var theScore = 0;
var indexOf = Array.prototype.indexOf;


function successAlert() {
   UIkit.notification('Correct! You gained 10 points', 'success');
}

function failAlert() {
   UIkit.notification('Wrong answer! Try again', 'danger');
}

function requestGameData( gameid ) {
  var json = null;

  // make the request
  $.ajax( {
    async: false,
    global: false,
    url: "data/capitals/game.json",
    dataType: "json",

    success: function( data ) {
      json = data;
      console.log(json);
    },

    complete: function( data, status ) {
      console.log(status)
    }
  });

  return json;
}
let gameData = requestGameData();

function requestAnswers( dataset ) {
  // temp code
  var json = null;

  // make the request
  $.ajax( {
    async: false,
    global: false,
    url: "data/" + gameData['short_name'] + "/" + dataset['label'] + ".json",
    dataType: "json",

    success: function( data ) {
      json = data['answers'];
      console.log(data);
    },

    complete: function( data, status ) {
      console.log(status)
    }
  });

  return json;
}


/** Data Loading - move this to gamedata.js and handle all io there **/
let _answers = Array();
let answers = Array();

let _questions = Array();
let questions = Array();

function loadData( data ) {
  // load data into carousel
  //$(data).find('option').each(function(index, element) {
  for ( var i = 0; i < data.length; i++ ) {
    // normalize the data
    var normalizedQuestion = escape(data[i]['question'].replace(/\s+/g, '_'));
    var normalizedAnswer =  escape(data[i]['answer'].replace(/\s+/g, '_'));

    // push answer values into Array
    _answers.push(normalizedAnswer);
    answers.push(data[i]['answer']);

    _questions.push(normalizedQuestion);
    questions.push(data[i]['question']);

    var _icon = $("<i></i>").addClass("material-icons")
                            .html("location_on");

    var _header = $("<h2></h2>").addClass("question-text")
                                .append($(_icon))
                                .append(' ' + data[i]['question']);

    var _p = $("<p></p>").attr('id', "possibilities");

    var _caption = $("<div></div>").addClass("carousel-caption");

    var _img = $("<img></img>").attr('src', "assets/img/countries/Africa/" + normalizedQuestion + "/" + normalizedQuestion + "02.png")
                               .prop('alt', data[i]['question']);

    var _item = $("<div></div>").attr('id', normalizedAnswer)
                                .addClass("item");

    //var _answerForm = $('#answer-box').html;
    $(_caption).append($(_header));
    $(_caption).append($(_p));
    $(_item).append($(_img));
    $(_item).append($(_caption));

    $('.carousel-inner').append($(_item));

    $('#data-list').append( $('<option>', {
      value: data[i]['answer'],
      text : data[i]['question']
    }));

  }

  $('.carousel-inner .item:first').addClass('active');
  $('#countries-carousel').carousel(0);

  return _answers;
}

function changeScore(val) {
  theScore = theScore + val;
  $('.the-score').html(theScore);
}

function chooseRandomQuestion() {
   index = Math.floor(Math.random()*(questions.length)+1);
   return index-1;
}

function checkAnswer(sender, guess, ans) {
   //alert( $('#settings input.ignore-case')[0].checked );
   //ans = answer.val().replace(/\s+/g, '_');
   return ans.toLowerCase() == guess.toLowerCase();

   if ( $('#settings input.ignore-case')[0].checked == true ) {
      return ans.toLowerCase() == guess.toLowerCase();
   } else {
      return ans == guess;
   }
}

function submitAnswer(el) {
   // the guess should match the ID of the
   // pressed element
   var guess = $(el).attr('value');
   console.log(guess);
   // set by 'setQuestion()'
   var ans = $currAnswer;

   if (checkAnswer(el, guess, ans)) {
      doCorrectAnswer(el);
   } else {
      doWrongAnswer(el);
   }
   nextQuestion();

   var numTiles = $("#answer-grid").children().length;
   $("#answer-grid").fadeOut(1000, function() { updateAnswerTiles( numTiles ); });
}

function doCorrectAnswer(e) {
  successAlert();
  console.log('correct');

  // play animation
  $(e).addClass("uk-animation-reverse uk-animation-scale-down");

  // change score etc...
  changeScore(10);

  // add to answered and correct
  answered.push($currQuestion);
  correct.push($currQuestion);

  $('.answered').html(answered.length);
  $('.correct').html(correct.length);
}

function doWrongAnswer(e) {
  failAlert();
  console.log('incorrect');

  $(e).addClass("uk-animation-shake");
  setTimeout( function() { $(e).removeClass("uk-animation-shake"); }, 200 );

  changeScore(-1);

  answered.push($currQuestion);
  incorrect.push($currQuestion);

  $('.answered').html(answered.length);
  //$('.incorrect').html(incorrect.length);
}

var $currQuestion = "";
var $currAnswer = "";
function nextQuestion() {
   // get a random index from the questions Array
   var i = chooseRandomQuestion();

   // remove the question and answer
   $currQuestion = questions.splice(i, 1)[0];
   _questions.splice(i, 1);
   $(".the-question").html($currQuestion);

   $currAnswer = answers.splice(i, 1)[0];
   _answers.splice(i, 1);
   $(".the-answer").html($currAnswer);

   // trigger global event
   $( document ).trigger( "game:updated" );
   console.log($currAnswer);
}

function updateAnswerTiles(nTiles) {

    // animate and remove current objects
    $("#answer-grid").empty();

   // ensure there are enough answer to accomidate tiles
   if (questions.length < nTiles) {
      nTiles = answers.length;
   }

   var used = Array();
   var tobuild = Array();
   for ( var i=0; i < nTiles; i++ ) {
      // pick a random answer from
      var q = chooseRandomQuestion();

      // add question to chosen if not already there
      if (indexOf.call(used, q) > -1) {
         // found match, pick another
         i = i-1;
         continue;
      } else {
         used.push(q);
      }
      tobuild.push(answers[q]);
   }
   console.log(tobuild);
   // insert the correct answer at a random location
   var index = Math.floor(Math.random()*(nTiles)+0);
   tobuild.splice(index, 1, $currAnswer);

   $(tobuild).each( function(k,a) {
      $("#answer-grid").append(buildAnswerTile(a));
   });

   $("#answer-grid").fadeIn(1000);
}

function buildAnswerTile(a) {
   // build the element to insert
   $text = $('<p>', {
      class: "uk-text-muted uk-text-center",
      html: a
   });

   $card = $('<div>', {
      class: "uk-card uk-card-body uk-card-default uk-card-hover uk-text-center",
      html: $text,
      value: a,
      on: { 'click': function( e ) {
              submitAnswer(e.currentTarget);
            }
          }
   });

   $div = $('<div>', {
      html: $card
   });

   return $div;
}

function updateHint() {
  // update the hint text
  var hint = $('#the-answer').val().substring(0, slider2.noUiSlider.get());

  $('#hint-body').html(hint);
  $('#answer-form .tooltip-hint').attr('title', hint);
  $('#answer-form .tooltip-hint').tooltip('fixTitle');
}
