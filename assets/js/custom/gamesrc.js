var data_length = $('#africa-nations-list').children().length;

function successAlert() {
   var outerDiv = $("<div></div>").attr('id', "success-message").addClass("alert alert-success");
   var container = $("<div></div>").addClass("container-fluid");
   var iconBox = $("<div></div>").addClass("alert-icon");
   var icon = $("<i></i>").addClass("material-icons").html("check");

   var button = $("<button></button>").attr('type', "button").addClass("close");
   button.attr('data-dismiss', "alert")
            .attr('aria-label', "Close");
   button.html("<span aria-hidden='true'><i class='material-icons'>clear</i></span>")

   var message = "<b>Success!</b> You gained 10 points";

   $(iconBox).append($(icon));
   $(container).html(message);
   $(container).append($(iconBox));
   $(container).append($(button));
   $(outerDiv).append($(container));

   return $(outerDiv)
}

function failAlert() {
   var outerDiv = $("<div></div>").attr('id', "fail-message").addClass("alert alert-danger");
   var container = $("<div></div>").addClass("container-fluid");
   var iconBox = $("<div></div>").addClass("alert-icon");
   var icon = $("<i></i>").addClass("material-icons").html("error_outline");

   var button = $("<button></button>").attr('type', "button").addClass("close");
   button.attr('data-dismiss', "alert")
         .attr('aria-label', "Close");
   button.html("<span aria-hidden='true'><i class='material-icons'>clear</i></span>")

   var message = "<b>Error!</b> Wrong answer, try again or pass";

   $(iconBox).append($(icon));
   $(container).html(message);
   $(container).append($(iconBox));
   $(container).append($(button));
   $(outerDiv).append($(container));

   return $(outerDiv)
}

var _answers = Array();

function loadData( data ) {
   // load data into carousel
   $(data).find('option').each(function(index, element) {
      var normCountry = escape(element.text.replace(/\s+/g, '_'));
      var normCity =  escape(element.value.replace(/\s+/g, '_'));

      _answers.push(normCity);

      var _icon = $("<i></i>").addClass("material-icons")
                                          .html("location_on");
      var _h3 = $("<h2></h2>").addClass("question-text")
                                          .append($(_icon));
      var _p = $("<p></p>").attr('id', "possibilities");

      _h3.html(_h3.html() + ' ' + element.text);

      var _caption = $("<div></div>").addClass("carousel-caption");
      var _img = $("<img></img>").attr('src', "assets/img/countries/Africa/" + normCountry + "/" + normCountry + "02.png")
                                              .prop('alt', element.text);
      var _item = $("<div></div>").attr('id', normCity)
                                          .addClass("item");

      //var _answerForm = $('#answer-box').html;
      $(_caption).append($(_h3));
      $(_caption).append($(_p));
      $(_item).append($(_img));
      $(_item).append($(_caption));

      $('.carousel-inner').append($(_item));

      $('#data-list').append($('<option>', {
         value: element.value,
         text : element.text
      }));

   });

   $('.carousel-inner .item:first').addClass('active');
   $('#countries-carousel').carousel(0);

   return _answers;
}

function chooseRandomCountry() {
   index = Math.floor(Math.random()*(data_length-0+1)+0);
   return index;
}

function checkAnswer(sender, guess, answer) {
   //alert( $('#settings input.ignore-case')[0].checked );
   ans = answer.val().replace(/\s+/g, '_');

   if ( $('#settings input.ignore-case')[0].checked == true ) {
      return ans.toLowerCase() == guess.toLowerCase();
   } else {
      return ans == guess;
   }

   // debug

}

var data_list = {
   'africa': '#africa-nations-list',
   'europe': '#europe-nations-list',
   ///etc.
};
