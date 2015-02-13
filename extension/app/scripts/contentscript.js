'use strict';

console.log('Welcome to the EFL Helper Chrome extension');

// try to customize the tooltip
//(function( $ ) {
//  $.widget( "custom.tooltipX", $.ui.tooltip, {
//    options: {
//      autoHide:true
//    },
//
//    _create: function() {
//      this._super();
//      if(!this.options.autoHide){
//        this._off(this.element, "mouseover focusin");
//      }
//    },
//
//    _open: function( event, target, content ) {
//      this._superApply(arguments);
//
//      if(!this.options.autoHide){
//        this._off(this.element, "mouseleave focusout");
//      }
//    }
//  });
//
//}( jQuery ) );

var config = {
  //salsaBackendUrl: 'http://0.0.0.0:8080/hello'
  salsaBackendUrl: 'http://127.0.0.1:8080/wordnet'
}

// TODO: add material design styles?
// TODO: this method hijacks other angular apps from the page
var eslPluginApp = window.App = angular.module('eslPlugin', ['eslPluginKeywords']);

eslPluginApp.config(function () {
  console.log('eslPlugin app config');
});

// TODO: resolve words from server

eslPluginApp.directive('eslPluginElement',['$log', '$timeout', 'keywords', function($log, $timeout, keywords) {
  return {
    restrict: 'EA',
    link: function(scope, el, attrs) {
      $log.log('testDirective link function');
      var words = keywords;

      // jquery-ui tooltips
      $timeout(
        function() {
            $("p").html(function(_, html) {
            var anyWord = words.join('|')
            // the spaces around the word ensure that we don't find it inside other words
            // TODO: we need a better regex to handle (1) Caps (2) sentence beginnings, ends, and punctuation
            var re = new RegExp(' (' + anyWord + ') ', "g");
            // note the spaces around the <span> tags
            return html.replace(re, ' <span class="efl-interesting-word">$1</span> ');
          });

          $(document).tooltip({
            track: false,
            position: { my: "center bottom", at: "left top" },
            show: null, // show immediately
            open: function (event, ui) {
              console.log('OPEN EVENT:');
              console.log(event);
            },
            // let user hover into the tooltip
            close: function(event, ui){
              console.log('Close EVENT:');
              console.log(event);
              ui.tooltip.hover(
                function () {
                  $(this).stop(true).fadeTo(400, 1);
                },
                function () {
                  $(this).fadeOut("400", function(){
                    $(this).remove();
                  })
                }
              );
            },
            items: ".efl-interesting-word",
            content: function(displayCallback) {
              var element = $(this);
              var text = element.text();
              // TODO: this callback fails on https pages
              $.get(config.salsaBackendUrl + '/' + text, function(results) {
                //build the html representation
                //TODO: use ngRepeat with tooltip directive
                // res is a list of wordnet results

                //def
                //exp
                //synonyms
                var resList = results.map(function(res, senseIdx) {

                  var synonyms = res['synonyms'].map(function(syn) {
                    return '<div class="synonym">' + syn + '</div>';
                  }).join('');
                  var synsetHtml = '<div class="synonyms">' + synonyms + '</div>';

                  var examples = res['examples'].map(function(example) {
                    return '<div class="example">' + example + '</div>';
                  }).join('<hr/>');
                  var examplesHtml = '<div class="examples">' + examples + '</div>';

                  // increment to start counting at 1
                  senseIdx = Number(senseIdx) + 1;


                  return '<div class="sense-info">' +
                           '<h6>Sense: ' + senseIdx + '</h6>' +
                           '<h5>Definition: </h5>' +
                           '<div>' + res['def'] + '</div>' +
                           '<h5>Synonyms: </h5>' +
                           synsetHtml +
                           '<h5>Examples: </h5>' +
                           examplesHtml +
                           '</div><hr/>';
                }).join('');

                var formattedResults = '<div>' +
                                       '<h5>Word: ' + text + '</h5>' +
                                         resList +
                                       '</div>';
                displayCallback(formattedResults);
              })
              .fail(function() {
                displayCallback('<div>' + 'sorry, the server is not available' + '</div>');
              })
            }
          });
        },0
      )
    }
  }
}]);

// find the body tag with jquery, then add the directive attr to it
// note that this depends upon SYNCHRONOUS execution of the .attr function
$('body').attr('esl-plugin-element', '');
angular.bootstrap('body', ['eslPlugin']);
