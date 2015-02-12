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
  salsaBackendUrl: 'http://0.0.0.0:8080/wordnet'
}

// TODO: add material design styles?
// TODO: this method hijacks other angular apps from the page
var eslPluginApp = window.App = angular.module('eslPlugin', []);

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

                var resList = results.map(function(res) {
                  return '<div>' + res['gloss'] + '</div><hr/>';
                }).join('');
                var formattedResults = '<div>' + resList + '</div>';
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

eslPluginApp
  .service('keywords', ['$log', function($log) {
    return [
      "possibly",
      "permit",
      "accelerate",
      "accumulate",
      "across from",
      "adherence",
      "adornment",
      "aggravate",
      "air conditioning",
      "algorithm",
      "allusion",
      "amateurish",
      "ancient",
      "antiseptic",
      "appallingly",
      "approach",
      "architecture",
      "around-the-clock",
      "ascending",
      "attributable",
      "autograph",
      "backpacker",
      "ballerina",
      "barbarism",
      "basketball",
      "benediction",
      "biblical",
      "billy goat",
      "biweekly",
      "bleachers",
      "bloodless",
      "bombard",
      "breathless",
      "britches",
      "burglary",
      "buttress",
      "Canadian",
      "capital",
      "cartwheel",
      "Catch-22",
      "certifiable",
      "chauvinism",
      "chessboard",
      "chipmunk",
      "circumvention",
      "cleverly",
      "Coast Guard",
      "cologne",
      "communications",
      "complain",
      "con artist",
      "condensation",
      "conflict",
      "conscientious",
      "conspire",
      "contend",
      "contrite",
      "cookout",
      "courtship",
      "cranberry",
      "cuisine",
      "Cyrillic",
      "daredevil",
      "dead end",
      "delicate",
      "demoralize",
      "depreciate",
      "desktop computer",
      "dial tone",
      "disable",
      "disconcert",
      "disgraceful",
      "disobedient",
      "disrupt",
      "distraught",
      "dizziness",
      "double standard",
      "dribble",
      "dungeon",
      "each other",
      "embezzler",
      "empirical",
      "endorsement",
      "enormous",
      "entrance ramp",
      "escalation",
      "etiquette",
      "eviction",
      "excision",
      "exhilarate",
      "experimentally",
      "eyeliner",
      "fantasize",
      "fateful",
      "federalist",
      "fertility",
      "field day",
      "firewood",
      "flavored",
      "flushed",
      "fortune teller",
      "frailty",
      "freight train",
      "frivolity",
      "fucking",
      "gargoyle",
      "gentility",
      "glandular",
      "godfather",
      "goodwill",
      "grade point average",
      "grapefruit",
      "great-grandson",
      "grudging",
      "halftime",
      "hands-on",
      "hard-liner",
      "hatchet",
      "headrest",
      "helpful",
      "high jinks",
      "homonym",
      "horrendous",
      "hot spot",
      "hyphenate",
      "idealism",
      "illiteracy",
      "imminent",
      "imperialism",
      "impress",
      "inasmuch as",
      "inclusive",
      "incremental",
      "indices",
      "industrialist",
      "inference",
      "informality",
      "initiation",
      "inquisitive",
      "inspector",
      "insured",
      "interdependence",
      "intersect",
      "introverted",
      "involved",
      "irritability",
      "jackhammer",
      "John Doe",
      "kindhearted",
      "knockout",
      "law enforcement",
      "liability",
      "life-size",
      "lineage",
      "location",
      "lovingly",
      "lunchbox",
      "maddening",
      "main drag",
      "manslaughter",
      "marketing",
      "measurable",
      "meeting",
      "mentality",
      "metaphorically",
      "Middle Ages",
      "Milky Way",
      "minuscule",
      "misnomer",
      "molding",
      "monorail",
      "morning sickness",
      "motorbike",
      "mundane",
      "mutually",
      "narration",
      "nautical",
      "negligible",
      "newcomer",
      "nightmare",
      "nominally",
      "normality",
      "nursery rhyme",
      "obligatory",
      "officious",
      "ominously",
      "outdoors",
      "outskirts",
      "overhaul",
      "overthrown",
      "papier-mache",
      "parishioner",
      "patient",
      "peppermint",
      "persuade",
      "pharmacology",
      "phrasing",
      "pigheaded",
      "piously",
      "plagiarist",
      "playhouse",
      "pointless",
      "possessive",
      "preacher",
      "preemptive",
      "preregistration",
      "principality",
      "processor",
      "programming",
      "protagonist",
      "prudish",
      "public television",
      "punishment",
      "quarterfinal",
      "rag doll",
      "rattler",
      "receptacle",
      "recover",
      "redskin",
      "refreshments",
      "regularly",
      "release",
      "remittance",
      "reprove",
      "rest home",
      "retiree",
      "romanticize",
      "round-trip",
      "sabotage",
      "sanitary",
      "saunter",
      "science fiction",
      "screech",
      "seasick",
      "security deposit",
      "self-control",
      "semantic",
      "sentimentality",
      "shenanigans",
      "shoplift",
      "showman",
      "sick leave",
      "silently",
      "singing",
      "skydiving",
      "sleeveless",
      "slowpoke",
      "sniffle",
      "soft touch",
      "sometimes",
      "sound bite",
      "spaciousness",
      "specifics",
      "spontaneous",
      "standoff",
      "stature",
      "stereotype",
      "stipend",
      "storeroom",
      "streetcar",
      "substitution",
      "supportive",
      "suspend",
      "symptom",
      "task force",
      "teardrop",
      "terminate",
      "thankless",
      "thoroughness",
      "timekeeper",
      "tortilla",
      "transatlantic",
      "traumatic",
      "turnover",
      "two-dimensional",
      "umpteen",
      "uncharacteristically",
      "underneath",
      "undying",
      "unidentified",
      "unmarked",
      "untruthful",
      "valuables",
      "vertical",
      "vigilante",
      "visibility",
      "voluntarily",
      "waiting room",
      "warlike",
      "watchman",
      "wealthy",
      "well-behaved",
      "wharves",
      "widower",
      "withhold",
      "yearning"
    ]
  }]);
// find the body tag with jquery, then add the directive attr to it
// note that this depends upon SYNCHRONOUS execution of the .attr function
$('body').attr('esl-plugin-element', '');
angular.bootstrap('body', ['eslPlugin']);
