'use strict';

console.log('Welcome to the EFL Helper Chrome extension');

$(function() {
  $("p:contains('element')").html(function(_, html) {
    var word = 'element';
    var re = new RegExp('('+word+')',"g");
    // TODO: the regex here is literal -- parameterize it to support a list of words
    return html.replace(re, '<span class="efl-interesting-word">$1</span>');
  });

  //$('body:contains("•")').contents().each(function () {
  //  if (this.nodeType == 3) {
  //    $(this).parent().html(function (_, oldValue) {
  //      return oldValue.replace(/•/g, "<span class='bullets'>$&</span>")
  //    })
  //  }
  //});
    //alert('Yay, I\'m an extension :)');
    //console.log($('body'));
    //$('p').css('background-color', 'pink');
    //$('p').hover(function(e) {
    //    $(e.target).append('<h3>OMG I rule</h3>');
    //  },
    //  function(e) {
    //    $(e.target).find('h3').remove();
    //  }
    //);
});

// jquery-ui tooltip
$(function() {
  $( document ).tooltip({
    track: true,
    open: function (event, ui) {
      ui.tooltip.css("max-width", "400px");
      ui.tooltip.css("height", "100px");
      console.log('EVENT:');
      console.log(event);
    },
    items: ".efl-interesting-word",
    content: function(displayCallback) {
      var element = $( this );
      var text = element.text();
      $.get('http://localhost:8080/hello/' + text
        , function(data) {
          displayCallback(data); //**call the callback function to return the value**
      });
    }
  });
});

