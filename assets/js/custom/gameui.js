// at page load/ready
$().ready(function() {
  var slider2 = document.getElementById('sliderRefine');
  var data = loadData( requestAnswers( gameData["answer_datasets"][0] ) );

  //$('#the-game-screen').hide();

  noUiSlider.create(slider2, {
    start: [ 0 ],
    step: 1,
    range: {
      'min': [  0 ],
      'max': [ 10 ]
    }
  });

  slider2.noUiSlider.on('change', function( values, handle ) {
    // update the hint
    var hint = $('#the-answer').val().substring(0, values[handle]);
    $('#hint-body').html(hint);
    $('#answer-form .tooltip-hint').attr('title', hint);
    $('#answer-form .tooltip-hint').tooltip('fixTitle');
    // store for external
    // $('#slider2-val').val( slider2.noUiSlider.get() );
  });

  console.log($('#the-answer').val());

  // After a slide
  $('#countries-carousel').on('slid.bs.carousel', function (e) {
    $('#answer-form .form-group').removeClass('has-success');
    $('#answer-form .input-group:first').toggleClass('invisible');

    // update_answer
    $('#the-answer').val(e.relatedTarget.id);
    $('#the-guess').focus();

    console.log(e.relatedTarget.id);

    // update the hint text
    var hint = $('#the-answer').val().substring(0, slider2.noUiSlider.get());
    hint = hint.replace(/\s+/g, '_');
    $('#hint-body').html(hint);
    $('#answer-form .tooltip-hint').attr('title', hint);
    $('#answer-form .tooltip-hint').tooltip('fixTitle');


    if (e.relatedTarget.id == 'start') {
      $('#answer-form').fadeOut();
      $('#start-button').fadeIn();
    }
  });
});

// start the game
$('#start-button').on('click', function(e) {
    e.preventDefault();

    index = chooseRandomQuestion();
    $('#countries-carousel').carousel(index);

    // set everything to 0
    $('#start-button').fadeOut();
    $('#the-game-screen').fadeIn();
    $('#answer-form').fadeIn();

    console.log($('#the-answer').val());

    // Scorecard
    $('#profile input[name="items_solved"]').val(0);
    $('#profile input[name="items_passed"]').val(0);
    $('#profile input[name="items_missed"]').val(0);
});

// Event fires whenever the answer text changes.
$('input#the-guess').on('input', function( e ) {
  // create options list

  // remove the hint buttons displayed
  $('#answer-form .row:last .input-group:first button').remove();
  var eles = $("#data-list option[value^=\""+ $(this).val() +"\"]");
  $(eles).each( function( index, option ) {
    $('#answer-form .row:last .input-group:first').append($('<button>', {
      class: "btn btn-simple btn-xs",
      html: option.value,
      fadeIn: true,
      on: { 'click': function( e ) {
          e.preventDefault();
          $('#the-guess').val( $(e.target).html() );
          $('#answer-form').submit();
        },
      },
    }));
  });
  console.log(eles.length);
});

// Hint tooltip click
$('#answer-form .tooltip-hint').on('click', function(e) {
   $('#the-guess').focus();
   $('#the-guess').val( $('#hint-body').html() );
})

// prevent buttons from submitting scorecard form
$('#scorecard').on('submit', function(e) {
      e.preventDefault();
});

// whenever an answer is submitted
$('#answer-form').on('submit', function(e) {
  e.preventDefault();

  // escape symbols and remove spaces
  var _theguess = escape($('#the-guess').val().replace(/\s+/g, '_'));

  // clear hints
  $('#answer-form .row:last .input-group:first button').remove();

  // check answer
  var _correct = checkAnswer(this, _theguess, $('#the-answer'));

  if (_correct == true) {
    // debugging
    console.log("correct");

    _ele = $('#answer-form .form-group')[0];
    $(_ele).addClass("has-success");

    $('#the-guess').val('');

    var _alert = successAlert();

    // score
    var _score = $('#scorecard input[name="the_score"]');
    _score.val(+_score.val() + 10);

    // show tick
    $('#answer-form .input-group:first').toggleClass('invisible');

    // Solved
    var _solved = $('#scorecard input[name="items_solved"]');
    _solved.val(+_solved.val() + 1);

    // Passed
    //var _passed = $('#profile input["name=items_solved"]');
    //_passed.val(_solved.val() + 1);

    //$('#countries-carousel').carousel('next');

    index = chooseRandomQuestion();
    $('#countries-carousel').carousel(index);

  } else {
    var _alert = failAlert();
    // if we give mutltiple tries, show pass button
    // otherwise just add missed

    // Missed
    var _missed = $('#scorecard input[name="items_missed"]');
    _missed.val(+_missed.val() + 1);
    $('#the-guess').val('');
    $('#the-guess').focus();
  }

  _alert.fadeTo(2000, 500).slideUp(500, function(){_alert.slideUp(500)});
  $('#messages').html(_alert);

return false;

});
