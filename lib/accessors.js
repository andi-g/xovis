// //////////////////////////////////////////////////////////////////////////
// data accessor functions for xovis
// //////////////////////////////////////////////////////////////////////////

// //////////////////////////////////////////////////////////////////////////
// total number of journal entries per project
var num_journal_entries_accessor = function(base_url, 
        callback, element, link_url) {
    var res = {};
    var data_url = base_url + '?group_level=1';
    d3.json(data_url, function(error, data) {
        if (!error) {
            filtered_data = data.rows.filter(function(d) { 
                return d.key[0] != null; 
            });
            filtered_data.sort(function(a, b) { 
                return ((a.value < b.value) ? 1 : -1);
                return 0;
            });
             
            res = {"values": filtered_data, 
                      "key": "Number of journal entries"};
            callback(res, element, link_url);
         }
    });
};

// //////////////////////////////////////////////////////////////////////////
// get the project with the most activity logs
var project_name_with_most_activity_logs = function(base_url, 
        callback) {
    var res = {};
    var data_url = base_url + '?group_level=1';
    d3.json(data_url, function(error, data) {
        if (!error) {
            filtered_data = data.rows.filter(function(d) { 
                return d.key[0] != null; 
            });
            filtered_data.sort(function(a, b) { 
                return ((a.value < b.value) ? 1 : -1);
                return 0;
            });
             
            console.log('top project query');
            res = {"values": filtered_data[0], 
                      "key": "Top project"};
            console.log(res);
            callback(res);
         }
    });
}

// //////////////////////////////////////////////////////////////////////////
// number of journal entries by project and time of day
var time_of_day_accessor = function(base_url, callback, element, title) {
    var res = [];
    var data_url = base_url + '&group_level=2';

    d3.json(data_url, function(error, data) {
        if (!error) {
            data.rows.sort(function(a, b) { 
                return ((a.value < b.value) ? 1 : -1);
                return 0;
                });
            var total_sum_data = data.rows;

            var top_five = total_sum_data.slice(0, 5);
            var top_five_activities = top_five.map(function(row) { 
                return row.key.slice(0, 2).join(); });

            var data_url = base_url + '&group_level=3';
            d3.json(data_url, function(error, data) {
                if (!error) {
                    var raw_data = data.rows;

                    var nested_data = d3.nest()
                        .key(function(d) { return d.key.slice(0, 2); })
                        .entries(raw_data);

                    nested_data.forEach(function(row) {
                        if (top_five_activities.indexOf(row.key) >= 0) {
                            var drow = {"values": row.values.map(function(d) { 
                                            return { "x": d.key[2], 
                                                     "y": d.value,
                                                     "key": d.key[1] }; 
                                            }), 
                                        "key": row.values[0].key[1]};
                            res.push(drow);
                        }
                    });
                    callback(res, element, title, false);
                 }
             });
        }
    });
};

// //////////////////////////////////////////////////////////////////////////
// number of activities of a project by month
var month_accessor = function(base_url, callback, element, title) {
    var month_order = ['January', 'February', 'March', 'April', 'May',
                       'June', 'July', 'August', 'September', 'October',
                       'November', 'December'];
    var res = [];
    var data_url = base_url + '&group_level=2';
    d3.json(data_url, function(error, data) {
        if (!error) {
            var data_dict = {};
            data.rows.forEach(function(row) {
                data_dict[row.key[1]] = row;
            });
            var month_data = month_order.map(function(month) {
                return data_dict[month];
            });
            var points = [];
            month_data.forEach(function(row) {
                if (row) {
                    var drow = { "x": row.key[1], 
                                 "y": row.value,
                                 "key": row.key[1] }; 
                    points.push(drow);
                }
            });
            res.push({"values": points, 
                      "key": "Number of activities by month"});
            callback(res, element, title, true);
         }
    });
};

// //////////////////////////////////////////////////////////////////////////
// number of journal entries by activity for a given project
var plain_data_accessor = function(base_url, callback, element, title) {
    var res = {};
    var data_url = base_url + '&group_level=2';
    d3.json(data_url, function(error, data) {
        if (!error) {
            data.rows.sort(function(a, b) { 
                return ((a.value < b.value) ? 1 : -1);
                return 0;
                });
            res = {"values": data.rows, 
                      "key": "Number of activities"};
            callback(res, element, title);
         }
    });
};
