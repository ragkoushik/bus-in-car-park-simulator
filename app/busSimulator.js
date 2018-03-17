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
    readline = require('readline'),                     // Readline class. To read commands from a file
    rl, 						// readline instance
    argv, 						// for cli arguments, particularly to get a file path
    messenger = bus.getMessenger();                     // to interact with users

stdin.setEncoding('utf8');
process.title = "Bus in a car park Simulator"; // Terminal title

argv = process.argv.slice(2); // get only the name of the file from user prompt


// read stdin
// this piece of code is for reading user's input from CLI
stdin.on('data', function(data) {
    outputMesage(data);
});


// this piece of code is for reading commands from a file
if (argv.length) {
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
    if (res instanceof Error) {
        stdout.write(res.message + EOL + '> ');
    } else if (typeof res == 'string') {
        stdout.write(res + EOL + '> ');
    } else {
        stdout.write('> ');
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
