'use strict';

/**
 * bus Simulator app. Master module that starts the simmulator 
 * app. It requires the bus instance and uses its methods to
 * operate it.
 */

/**
 * Declare and initialize variables
 */
var os = require("os"), 				// to have platform independent EOL
    stdin = process.stdin,				// standard input handle
    stdout = process.stdout,				// standard output handle
    stderr = process.stderr,				// standard error handle
    bus = require('./busFactory'), 			// creates bus instance
    EOL = os.EOL, 							 
    fs = require('fs'), 				// to check if a file exists and is readable and to create a stream
    http = require('http'),
    url = require('url'),
    path = require('path'),
    util = require('util'),
    readline = require('readline'),                     // Readline class. To read commands from a file
    rl, 						// readline instance
    argv, 						// for cli arguments, particularly to get a file path
    config = require('./config'),
    path = require('path'),
    messenger = bus.getMessenger();                     // to interact with users

stdin.setEncoding('utf8');
process.title = "Bus in a car park Simulator"; // Terminal title

argv = process.argv.slice(2); // get only the name of the file from user prompt


// read stdin
// this piece of code is for reading user's input from CLI
stdin.on('data', function(data) {
    outputMesage(data);
});

if (argv.length) {
    // Input from front end
    if ( argv[0] !== undefined && argv[0].indexOf('--port') !== -1) { 
        var root = path.dirname(require.main.filename);
        var port = argv[1] || config.defaultPort;
        
        http.createServer(function (req, res) { 
            var pathname = url.parse(req.url).pathname;
            var m;
            if (pathname == '/') {
                bus._resetBusPosition(); 
                res.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream(root + '/public/view/index.html').pipe(res);
                return;
            } 
            else if (m = pathname.match(/^\/js\//)) {
                var filename = root + '/public' + pathname;
                var stats = fs.existsSync(filename) && fs.statSync(filename);
                if (stats && stats.isFile()) {
                    res.writeHead(200, {'Content-Type' : 'application/javascript'});
                    fs.createReadStream(filename).pipe(res);
                    return;
                }
            }
            else if (pathname == '/fetch-simulator-config'){
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.write(JSON.stringify({config: config}));
                res.end();
                return;
            }
            else if (req.method == 'POST' && pathname == '/control-bus'){
                var body = '';
                var message,success;
                req.on('data', function (data) {
                    body += data;
                });

                req.on('end', function () {
                    var jsonObj = JSON.parse(body);
                    var message, success;
                    if (jsonObj !== undefined && jsonObj.cmd !== undefined ) {
                        var output = outputMesage(jsonObj.cmd);
                        if (output instanceof Error) {
                            message =  output.message;
                            success = false;
                        } else if (typeof output == 'string') {
                            message = output;
                            success = true;
                        } else {
                            success = true;
                        }

                        var currentPos = bus.currentPosition();
                        res.writeHead(200, {'Content-Type' : 'application/json'});
                        res.write(JSON.stringify({message: message, success:success, currentPos: currentPos}));
                        res.end();
                    } 
                    else {
                        return;
                    }
                });
                
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
        }).listen(port, 'localhost');

        console.log('Server running on port ' + port);
    }
    else { // this piece of code is for reading commands from a file
        try {
            fs.accessSync(argv[0], fs.F_OK | fs.R_OK)
        } catch (e) {
            stderr.write(messenger.getMessage({
                msg: 'fileNotFound',
                fileName: argv[0]
            }));
            process.exit();
        }

        stderr.write(messenger.getMessage({
            msg: 'fileRead',
            fileName: argv[0],
                        eol: EOL
        }));

        rl = readline.createInterface({
            input: fs.createReadStream(argv[0]),
            terminal: false
        });

        // event handler. is called when a line is read from a file
        rl.on('line', function(line) {
            stdout.write(line + EOL);
            outputMesage(line);
        });

        // event handler. is called when all the lines in a file have been read
        // closes a stream and exit
        rl.on('close', function() {
            rl.close();
            process.exit();
        });
    }
}


/**
 * This parser encapsulates the task of reading a user's input, either form CLI
 * or from a file.
 *
 * @param  {String} cmd A command from a user, like "PLACE, MOVE, etc."
 * @return {Error|String|Object} Returns either an Error instance, or a message
 * string, or the bus instance. A successful action returns bus's instance.
 * @private
 */
var processCmd = function (cmd) {
    var res;
    // PLACE X(,| )Y(,| )F(  *)
    if (cmd.match(/^\s*place\s+\w+(?:,?\s*|\s+)\w+(?:,?\s*|\s+)\w+\s*$/i)) {
        var params = cmd.trim().split(/(?:\s+|,\s*)/i).slice(1);
        res = bus.place(params[0], params[1], params[2]);
    } else if (cmd.match(/^move\s*$/i)) {
        res = bus.move();
    } else if (cmd.match(/^left\s*$/i)) {
        res = bus.left();
    } else if (cmd.match(/^right\s*$/i)) {
        res = bus.right();
    } else if (cmd.match(/^report\s*$/i)) {
        res = bus.report();
    } else {
        res = new Error(messenger.getMessage({
            msg: 'unknownCommand'
        }));
    }
    return res;
};

/**
 * Sends a response from processCmd() to stdout or stderr
 * @param  {Error|String|Object} either an Error instance, or a message string,
 * or bus instance.
 * @return {undefined}      no return. the func only sends to stdout or stderr
 */
var outputMesage = function (data) {
    var res, _data = data.trim();

    if (_data.match(/(q|quit|exit)/i))
        process.exit();

    res = processCmd(_data);
    
    // send response to UI if being operated from the UI
    if (argv[0] !== undefined && argv[0].indexOf('--port') !== -1) {
        return res;
    } else {
        if (res instanceof Error) {
            stdout.write(res.message + EOL + '> ');
        } else if (typeof res == 'string') {
            stdout.write(res + EOL + '> ');
        } else {
            stdout.write('> ');
        }
    }
};


/**
 * BusSimulator class
 * It has only one static method .run() to start the app
 */
var BusSimulator = function () {};

/**
 * @static
 */
BusSimulator.run = function() {
    stdout.write(messenger.getMessage({
        msg: 'welcome',
        eol: EOL
    }) + EOL + '> ');
    stdin.resume();
};


module.exports = BusSimulator;
