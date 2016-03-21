// ////////////////////////////////////////////////////////////////////////////////////
// xovis angular pieces
var xovis_viz = angular.module('xovis_viz', []);

var db_url = 'http://localhost:5984/xovis_ng';

// ////////////////////////////////////////////////////////////////////////////////////
// xovis top menu
xovis_viz.directive('xovisTopMenu', function() {
  function link(scope, element, attr){
    var base_url = db_url + '/_design/app/_view/' + scope.viztype;
    num_journal_entries_accessor(base_url, draw_top_menu, element, scope.linkurl);
  }

  return {
    link: link,
    restrict: 'E',
    scope: { viztype: '@',
        linkurl: '@'
    }
  }
});

// ////////////////////////////////////////////////////////////////////////////////////
// xovis bar chart
xovis_viz.directive('xovisBarChart', function() {
  function link(scope, element, attr){

    var search = window.location.search.slice(1);
    var key_value_pairs = search.split('&');
    var key_values = {};
    for (var i = 0; i < key_value_pairs.length; i++) {
        var kv = key_value_pairs[i];
        var arr = kv.split('=');
        key_values[arr[0]] = arr[1];
    }

    var project = key_values.project;
    var viztype = scope.viztype;
    var title = scope.title;

    var base_url = db_url + '/_design/app/_view/' + viztype + 
        '?startkey=[%22' + project + '%22]&endkey=[%22' + project + '_%22]';
    plain_data_accessor(base_url, draw_bar_chart, element, title);

  }

  return {
    link: link,
    restrict: 'E',
    scope: { viztype: '@',
        title: '@'
    }
  }
});

// ////////////////////////////////////////////////////////////////////////////////////
// xovis line chart
xovis_viz.directive('xovisLineChart', function() {
  function link(scope, element, attr){

    var search = window.location.search.slice(1);
    var key_value_pairs = search.split('&');
    var key_values = {};
    for (var i = 0; i < key_value_pairs.length; i++) {
        var kv = key_value_pairs[i];
        var arr = kv.split('=');
        key_values[arr[0]] = arr[1];
    }

    var project = key_values.project;
    var viztype = scope.viztype;
    var title = scope.title;

    var base_url = db_url + '/_design/app/_view/' + viztype + 
        '?startkey=[%22' + project + '%22]&endkey=[%22' + project + '_%22]';
    if (viztype == "timeofday") {
        time_of_day_accessor(base_url, draw_line_plot, element, title);
    } else {
        month_accessor(base_url, draw_line_plot, element, title);
    }
    
  }
  return {
    link: link,
    restrict: 'E',
    scope: { viztype: '@',
        title: '@'
    }
  }
});

// ////////////////////////////////////////////////////////////////////////////////////
// xovis visualization controller
xovis_viz.controller('XovisVizCtrl', function($scope, $http, $location) { 
    var vm = this;

    var search = window.location.search.slice(1);
    var key_value_pairs = search.split('&');
    for (var i = 0; i < key_value_pairs.length; i++) {
        var kv = key_value_pairs[i];
        var arr = kv.split('=');
        vm[arr[0]] = arr[1];
    }
    
    // if no project name is provided, we pull the project with 
    // the most log entries
    if (!vm.project) { 
        var reload_page = function(res) {
            console.log('in reload page');
            var link_url = window.location.search.slice(0);
            window.location.assign(link_url + 
                '?project=' + res.values.key);           
        }

        var base_url = db_url + '/_design/app/_view/activity';
        project_name_with_most_activity_logs(base_url, reload_page);
    }
});
