'use strict';

/**
 * Config object
 * It consists of configs for:
 *   Bus class
 *   Messenger class
 *   CarPark class
 */

var config = {};
var path = require('path');

module.exports = config;

config.app = {
    root: path.resolve(__dirname),
},
config.carPark = {
    startPointX: 0,
    startPointY: 0,
    lengthX: 5,
    lengthY: 5
};
config.bus = {
    aCommands: ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'],
    initialCommands: ['PLACE'],
    aDirections: ['NORTH', 'EAST', 'SOUTH', 'WEST']
};
config.messenger = {
    oMsgs: {
        noInitialCommand: 		'Warning! You haven\'t placed the bus on the car park yet. Type "PLACE X, Y, F" Eg: 1,1, South {ci} to place it on the car park.',
        placebusFirst: 			'Nothing to report - no buses found on the car park. Re-try after placing one, to begin - PLACE X, Y, F.',
        wrongPlace: 			'Error! Invalid coordinate specified. That square is out of the car park.',
        wrondDirection: 		'Error! Invalid direction. Available directions are: {availableDirections}',
        noFace: 			'Error! No FACE was provided. Correct form is: PLACE X, Y, FACE.',
        faceNotString: 			'Error! FACE is not a string.',
        unknownCommand: 		'Error! Command is incorrect or unknown. Available commands are: {availableCommands}',
        busPosition: 			'bus\'s position is: {x}, {y}, {f}',
        noNegativeCoordinates:          'Error! Negative coordinates are not allowed.... Try again.',
        nonIntCoordinates: 		'Warning! Coordinates must be integers.',
        wrongMove: 			'Warning! You cannot move the bus that way, it can fall.',
        default: 			'Hi there! Welcome to Toy bus Simulator . Start by placing a bus on the tabletop, PLACE X, Y, F {ci} Eg: 1,1, South.',
        someCombinedMsg: 		'For the {s} of testing: PLACE {x}, {y}, {z} in {country}',
        fileNotFound: 			'Error! File \'{fileName}\' was not found. Make sure you specified its path correctly.',
        fileRead: 			'Reading commands from \'{fileName}\' .... please wait.{eol}',
        welcome: 			'Hi there!{eol}Begin by placing the bus on the car park - PLACE X, Y, F Eg: 1,1, South {ci}. or \'q\' to exit.',
    },
    oSubs: {
        availableDirections: config.bus.aDirections.join(', '),
        availableCommands: [config.bus.aCommands.reduce(function(prev,
            cur) {
            if (prev == 'PLACE')
                prev = [prev, 'X, Y, F'].join(' ');
            return prev + ' | ' + cur;
        }), '.'].join(''),
        ci: '(case insensitive, spaces are acceptable instead of commas)',
        country: 'New Zealand'
    }
};
