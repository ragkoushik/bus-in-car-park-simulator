'use strict';

module.exports = CarPark;

/**
 * The CarPark class, constructor
 * @param {object} config playgroung's config
 * @constructor
 */
function CarPark(config) {
    this._config = config;
}

var prototype = {
    /**
     * Check is X, Y are inside of the playground
     * @param  {INT}  x x-coordinate
     * @param  {INT}  y y-coordinate
     * @return {Boolean}
     */
    isOutOfcarPark: function(x, y) {
        if (
            (x > (this._config.startPointX + (this._config.lengthX - 1))) ||
            (x < this._config.startPointX) ||
            (y > (this._config.startPointY + (this._config.lengthY - 1))) ||
            (y < this._config.startPointY)
        ) {
            return true;
        } else
            return false;
    },
}

CarPark.prototype = Object.create(prototype);
CarPark.prototype.constructor = CarPark;
