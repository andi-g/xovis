// //////////////////////////////////////////////////////////////////
// couchapp for the xovis visualization 
//
// Serves summary stats on xo journal entries stored in a couchdb. 

var couchapp = require('couchapp'), 
    path = require('path');

ddoc = 
    { _id:'_design/app'
    , rewrites : 
        [ {from:"/", to:'index.html'}
        , {from:"/api", to:'../../'}
        , {from:"/api/*", to:'../../*'}
        , {from:"/*", to:'*'}
        ]
    };

ddoc.views = {};

ddoc.views.show_all = {
    map: function(doc) { 
        emit(null, { 
            _rev: doc._rev, 
            _id: doc._id , 
            doc: doc 
        }); 
    }
};

ddoc.views.activity = {
    map: function (doc) {
      emit([doc.deployment, doc.activity], 1);
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
};

ddoc.views.files = {
  map: function (doc) {
    // if mime_type is not empty string, a file was generated
    if (doc.mime_type != "") {
      emit([doc.deployment, doc.activity], 1);
    }
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

ddoc.views.share = {
  map: function (doc) {
    if (doc["share-scope"] == "private") {
      emit([doc.deployment, doc.activity], 1);
    }
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

ddoc.views.timeofday = {
  map: function (doc) {
    // time is in UTC, so need to convert, which Date does automatically
    var time_diff = 345 * 60000;
    var orig_date = new Date(doc.mtime);
    var utc_date = new Date(orig_date.getTime() + time_diff);
    var hour = utc_date.getHours();
    emit([doc.deployment, doc.activity, hour], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

ddoc.views.months = {
  map: function (doc) {
    var month_names = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];
    var date = new Date(doc.mtime);
    var month = month_names[date.getMonth()];
    emit([doc.deployment, month], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
    if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
        throw "Only admin can delete documents on this database.";
    } 
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
