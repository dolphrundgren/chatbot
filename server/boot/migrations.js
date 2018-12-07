const path = require('path');

const app = require(path.resolve(__dirname, '../server'));
var ds = app.datasources.resume;
ds.automigrate('utterance', function(err) {
    if (err) throw err;

    var newutterance = [
        {
            message: 'hello',
            sessionid: 'aslj245',
            author: 'Maryanne'
        },
    ];

    app.models.Utterance.create(newutterance, function(err, model) {
        if (err) throw err;
        
        console.log('Created:', model);
    });
});

ds.disconnect();