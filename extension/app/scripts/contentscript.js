'use strict';

console.log('Welcome to the EFL Helper Chrome extension');

$(function() {
  });

  //$('body:contains("•")').contents().each(function () {
  //  if (this.nodeType == 3) {
  //    $(this).parent().html(function (_, oldValue) {
  //      return oldValue.replace(/•/g, "<span class='bullets'>$&</span>")
  //    })
  //  }
  //});

// Working - bootstrap the angular app on the <body> tag
// TODO: add material design styles?
var eslPluginApp = window.App = angular.module('eslPlugin', []);

eslPluginApp.config(function () {
  console.log('eslPlugin app config');
});

eslPluginApp.directive('testDirective',['$log', '$timeout', function($log, $timeout) {
  return {
    restrict: 'EA',
    link: function(scope, el, attrs) {
      $log.log('testDirective link function');

// jquery-ui tooltips
      $timeout(
        function() {
            $("p").html(function(_, html) {
            var words = ['the', 'and', 'text', 'wildcard', 'multiple'];
            var anyWord = words.join('|')
            // the spaces around the word ensure that we don't find it inside other words
            var re = new RegExp(' (' + anyWord + ') ', "g");
            // note the spaces around the <span> tags
            return html.replace(re, ' <span class="efl-interesting-word">$1</span> ');
          });

          $(document).tooltip({
            track: true,
            open: function (event, ui) {
              ui.tooltip.css("max-width", "400px");
              ui.tooltip.css("height", "100px");
              console.log('EVENT:');
              console.log(event);
            },
            items: ".efl-interesting-word",
            content: function(displayCallback) {
              var element = $(this);
              var text = element.text();
              // TODO: this callback fails on https pages
              $.get('http://localhost:8080/hello/' + text
                , function(data) {
                  // todo - set the models on the template instead of using the display callback
                  displayCallback('<div>'+text+'</div>');
                  //displayCallback(data); //**call the callback function to return the value**
                }).fail(function() {
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
$('body').attr('test-directive', '');
angular.bootstrap('body', ['eslPlugin']);
