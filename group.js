var fs = require('fs');
var d3 = require('d3-collection');
var $ = require('d3-dsv');

var base = 'data/processed';

fs.readdir(base, function(err, files) {
    files.forEach(function(file) {
        if(/csv$/.test(file)) {
            fs.readFile(base + '/' + file, 'utf8', function(e, temps) {
                var data = $.csvParse(temps);

                var rolled = d3.nest()
                    .key(function(d) { return d.year; })
                    .entries(data);

                var file_name = file.split('.')[0];

                fs.writeFile('data/grouped/' + file_name + '.json', JSON.stringify(rolled, null), function(err) {
                    console.log(err)
                });
            });
        }
    });
});