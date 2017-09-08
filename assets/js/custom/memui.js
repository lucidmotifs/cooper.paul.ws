/** memui class (UI Singleton) **/
var memui = new function() {
   // The main question display container
   this.qcont = "question-container";

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
      //$prev.fadeOut(500);
      $prev.animate({width:'toggle'},250);
      setTimeout( function() {
         $prev.remove();
      }, 500 );
   }

   this.getInfo = function () {
      return 'apple';
   };
}
