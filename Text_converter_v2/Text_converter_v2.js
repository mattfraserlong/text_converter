var fs = require('fs');
var walkPath = './input';

//read directory
var walk = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next() {
            var fileName = list[i];
            console.log(fileName);
            var file = list[i++];
            
            
            if (!file) {
                return done(null);
            }

            file = dir + '/' + file;

            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    walk(file, function (error) {
                        next();
                    });
                } else {
                    
                    /*----- read each file ---------*/
                    var path = require('path');
                    var readStream = fs.createReadStream(file, 'utf8');
                    var data = ''

                    readStream.on('data', function (chunk) {
                        data += chunk;
                    }).on('end', function () {
                        //write new file
                        someText = data.replace(/(\r\n|\n|\r)/gm, " ");
                        newPars = someText.replace(/\./g, ".</p><p>");
                        stripped = newPars.trim();

                        fs.writeFile('../text_converter_v2/output/' + fileName, stripped, (err) => {
                            // throws an error, you could also catch it here
                            if (err) throw err;

                            // success case, the file was saved

                        });
                    });

                    /* ----------- end of file reader -----------------*/

                    next();
                }
            });
        })();
    });
};

// Command line notifications
process.argv.forEach(function (val, index, array) {
    if (val.indexOf('source') !== -1) {
        walkPath = val.split('=')[1];
    }
});

console.log('-------------------------------------------------------------');
console.log('processing...');
console.log('-------------------------------------------------------------');

walk(walkPath, function (error) {
    if (error) {
        throw error;
    } else {
        console.log('-------------------------------------------------------------');
        console.log('finished.');
        console.log('-------------------------------------------------------------');
    }
});
