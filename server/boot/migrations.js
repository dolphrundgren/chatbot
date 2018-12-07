const path = require('path');

const app = require(path.resolve(__dirname, '../server'));
var ds = app.datasources.resume;
ds.autoupdate('utterance', function(err) {
    if (err) throw err;
});

ds.disconnect();