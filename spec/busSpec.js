'use strict';

/**
 * Testing Bus
 * 
 */

var CarPark = require('./../app/carPark');
var Messenger = require('./../app/messenger');
var config = require('./../app/config');
var Bus = require('./../app/bus');

describe('Bus Simmulator', function() {
    var bus;
    var carPark;
    var messenger;
    var x, y, f;
    var aDirections;

    beforeAll(function() {
        messenger = new Messenger(config.messenger);
    });

    beforeEach(function() {
        bus = new Bus(config.bus,
            new CarPark(config.carPark),
            messenger);
    });

    it('coordinates should be undefined at start', function() {
        var oPosition = bus._getBusPosition();
        expect(oPosition.x == undefined &&
            oPosition.y == undefined &&
            oPosition.f == undefined).toBe(true);
    });

    it('should report its position', function() {
        var x = 1,
            y = 2,
            f = 'east';

        bus.place(x, y, f);

        expect(bus.report()).toEqual(messenger.getMessage({
            msg: 'busPosition',
            x: x,
            y: y,
            f: f.toUpperCase()
        }));
    });

    it('should say "place me first to begin" at start', function() {
        expect(bus.report()).toEqual(messenger.getMessage({
            msg: 'placebusFirst'
        }));
    });

    it('should not accept nonInt X or Y', function() {
        var x = "foo",
            y = "1,4",
            f = "south";
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'nonIntCoordinates'
            })));
    });

    it('should not accept undefined FACE', function() {
        var x = "foo",
            y = "1,4",
            f;
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noFace'
            })));
    });

    it('should not accept non-string FACE', function() {
        var x = "foo",
            y = "1,4",
            f = 100;
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'faceNotString'
            })));
    });

    it('should not accept negative Y in PLACE', function() {
        var x = 0,
            y = -1,
            f = 'south';
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noNegativeCoordinates'
            })));
    });

    it('should not accept negative X in PLACE', function() {
        x = -1, y = 0, f = 'south';
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'noNegativeCoordinates'
            })));
    });

    it('should not accept invalid FACING words', function() {
        x = 2, y = 3, f = 'foo';
        expect(bus.place(x, y, f)).toEqual(new TypeError(
            messenger.getMessage({
                msg: 'wrondDirection'
            })));
    });

    it('should not be placed outside the carPark', function() {
        x = 0, y = 6, f = 'north';
        expect(bus.place(x, y, f)).toEqual(new Error(
            messenger.getMessage({
                msg: 'wrongPlace'
            })));
    });

    it('should have "_isFirstStepMade = false" before initial PLACE',
        function() {
            expect(bus._getIsFirstStepMade()).toBe(false);
        }
    );

    it('should set "_isFirstStepMade = true" upon successful initial PLACE',
        function() {
            var x = 3,
                y = 3,
                f = 'south';
            bus.place(x, y, f);
            expect(bus._getIsFirstStepMade()).toBe(true);
        });

    it('should change X, Y upon successful place', function() {
        var x = 3,
            y = 3,
            f = 'south',
            oPositionEnd = {};

        bus.place(x, y, f);

        oPositionEnd = bus._getBusPosition();

        expect(oPositionEnd.x == x &&
            oPositionEnd.y == y &&
            oPositionEnd.f == f.toUpperCase()).toBe(true);
    });

    it('should return itself if PLACE was successful', function() {
        x = 1, y = 1, f = 'south';
        expect(bus.place(x, y, f)).toEqual(bus);
    });

    it(
        'should not accept MOVE command before initial PLACE command',
        function() {
            expect(bus.move()).toEqual(new Error(
                messenger.getMessage({
                    msg: 'noInitialCommand'
                })));
        });


    it('should not be able to step out of the carPark', function() {
        var x = 4,
            y = 0,
            f = 'east';
        bus.place(x, y, f);
        expect(bus.move()).toEqual(new Error(
            messenger.getMessage({
                msg: 'wrongMove'
            })));
    });

    it('should successfully make a correct MOVE', function() {
        var x = 1,
            y = 1,
            f = 'east',
            pos;
        bus.place(x, y, f);
        bus.move();
        pos = bus._getBusPosition();
        expect(pos.x == x + 1 && pos.y == y && pos.f == f.toUpperCase())
            .toBe(true);
    });


    it('should not turn RIGHT before initial PLACE was made', function() {
        expect(bus.right()).toEqual(new Error(
            messenger.getMessage({
                msg: 'noInitialCommand'
            })));
    });

    it('should not turn LEFT before initial PLACE was made', function() {
        expect(bus.left()).toEqual(new Error(
            messenger.getMessage({
                msg: 'noInitialCommand'
            })));
    });

    it('should turn LEFT (change face)', function() {
        var x = 1,
            y = 1,
            f = 'north';
        bus.place(x, y, f);
        bus.left()
        expect(bus._getBusPosition().f).toEqual('WEST');
    });

    it('should turn RIGHT (change face)', function() {
        var x = 1,
            y = 1,
            f = 'north';
        bus.place(x, y, f);
        bus.right();
        expect(bus._getBusPosition().f).toEqual('EAST');
    });
});
