/** memui class (UI Singleton) **/
var memui = new function() {
   // The id main question display container
   this.qcont = "question-container";
   this.qtemplate = "mem-question-template"

   // Set the media for a new question
   this.setMedia = function(q) {
      // remove previous media
      $media = $('<img>', {
         src: 'assets/img/countries/Africa/'+q+'/'+q+'02.png',
         class: 'uk-cover'
      });
      $media.attr("uk-cover", "");
      $("#"+this.qcont).prepend($media);

      $prev = $("#"+this.qcont+" img:last-of-type");
      $container = $('#'+this.qcont);

      $container.removeClass('uk-animation-slide-right');
      $container.addClass('uk-animation-slide-left uk-animation-reverse');
      $container.animate({width:'toggle'}, 350);
      setTimeout( function() {
         $prev.remove();
         $container.removeClass('uk-animation-slide-left uk-animation-reverse');
         $container.addClass('uk-animation-slide-right');
         $container.animate({width:'toggle'}, 350);
      }, 350 );
   }

   this.setQuestionTemplate = function( text ) {
      $("."+this.qtemplate).html(text.replace('$', this.questionText($currQuestion)[0].outerHTML));
   }

   // A text label for the current question
   // return element
   this.questionText = function( text, tag='span' ) {
      $el = $('<span>', {
         class: 'mem-question-text',
         html: text
      });

      return $el;
   }

   this.getInfo = function () {
      return 'apple';
   };
}
