/**
 * Testing robot position on carPark
 */
const CarPark = require('./../app/carPark');
const config = require('./../app/config');


describe('carPark', () => {
    let carPark;
    const xOuts = [config.carPark.startPointX - 1, config.carPark.lengthX];
    const yOuts = [config.carPark.startPointY - 1, config.carPark.lengthY];
    const yIns = [config.carPark.startPointY, config.carPark.lengthY - 1];
    const xIns = [config.carPark.startPointX, config.carPark.lengthX - 1];

    beforeAll(() => {
        carPark = new CarPark(config.carPark);
    });

    function loopInvalidY(x, y) {
        it('shoud return invalid = TRUE if Y coordinate is OUTSIDE carPark', () => {
            expect(carPark.isOutOfcarPark(x, y)).toBe(true);
        });
    }

    function loopValidY(x, y) {
        it('shoud return invalid = FALSE if Y coordinate is INSIDE carPark', () => {
            expect(carPark.isOutOfcarPark(x, y)).toBe(false);
        });
    }


    function loopInvalidX(x, y) {
        it('shoud return invalid = TRUE if X coordinate is OUTSIDE carPark', () => {
            expect(carPark.isOutOfcarPark(x, y)).toBe(true);
        });
    }

    function loopValidX(x, y) {
        it('shoud return invalid = FALSE if X coordinate is INSIDE carPark', () => {
            expect(carPark.isOutOfcarPark(x, y)).toBe(false);
        });
    }

    /**
     * Y is OUTside
     */
    for (var x = config.carPark.startPointX; x < config.carPark.lengthX; ++x) {
        for (var i = 0; i < yOuts.length; ++i) {
            loopInvalidY(x, yOuts[i]);
        }
    }

    /**
     * Y is INside
     */
    for (var x = config.carPark.startPointX; x < config.carPark.lengthX; ++x) {
        for (var i = 0; i < yIns.length; ++i) {
            loopValidY(x, yIns[i]);
        }
    }

    /**
     * X is OUTside
     */
    for (var y = config.carPark.startPointY; y < config.carPark.lengthY; ++y) {
        for (var i = 0; i < xOuts.length; ++i) {
            loopInvalidX(xOuts[i], y);
        }
    }

    /**
     * X is INside
     */
    for (var y = config.carPark.startPointY; y < config.carPark.lengthY; ++y) {
        for (var i = 0; i < xIns.length; ++i) {
            loopValidX(xIns[i], y);
        }
    }
});
