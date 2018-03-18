'use strict';

/**
 * The Bus class. Bus's constructor function.
 * The Bus's dependencies are: the Playground and the Messenger instances
 * @param {object} config    Bus's config
 * @param {Playground} playgroud The Playground instance
 * @param {Messenger} messenger The Messenger instance
 * @constructor
 */
var Bus = function (config, carPark, messenger) {

    this._config = config,
	this.carPark = carPark,
	this._messenger = messenger,
	this._isFirstStepMade = false,
	// Storing FACE as an INT and not as a string (such as 'north', 'east',
	// etc.). INT references index in a config.aDirections array ['NORTH',
	// 'EAST', 'SOUTH', 'WEST'] At the very beginning coordinates are
	// undefined. Coordinates get defined after a Bus is correctly
	// PLACEd X,Y,F
	this._oCurrentPosition = {
		x: undefined,
		y: undefined,
		f: undefined
	};
	
    /**
     * To PLACE the Bus
     * @param  {INT|String} x X-coordinate
     * @param  {INT|String} y y-coordinate
     * @param  {String} f FACE coordinate ('NORTH','EAST', 'SOUTH', 'WEST'). Can
     * come either lowercased of uppercased
     * @return {Error|Bus}   If placed succsessfully it returs this, if not
     * successfully, it returns a corresponding Error instance
     * @public
     */
    this.place = function(x, y, f) {

        var arg = {};

        // Validate user input
        try {
            arg = this._validateInput(x, y, f);
        } catch (e) {
            return e;
        }

        // PLACE a Bus only inside of the car park
        if (this._isOutOfcarPark(arg.x, arg.y)) {
            return new Error(this._messenger.getMessage({
                msg: 'wrongPlace'
            }));
        }

        // Places a Bus - updates its X,Y,F
        this._setBusPosition(arg.x, arg.y, arg.f);

        // Save that initial PLACE has been made
        if (!this._isFirstStepMade)
            this._isFirstStepMade = true;

        return this;
    };

    /**
     * To MOVE the Bus. It is not possible to move the Bus if no initial
     * PLACE was made - error is returned.
     * @return {Error|Bus} Bus's instance on succsess and Error instance if
     * any error occurred
     * @public
     */
    this.move = function() {
        var x, y, f;

        // Check if initial PLACE command was made
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));;
        }

        x = this._oCurrentPosition.x;
        y = this._oCurrentPosition.y;
        f = this._oCurrentPosition.f;

        // Change X or Y correctly to
        switch (f) {
            case 0: // north
                ++y;
                break;
            case 1: // east
                ++x;
                break;
            case 2: // south
                --y
                break;
            case 3: // west
                --x;
                break;
        }

        // Check if the step in not outside the playground
        if (this._isOutOfcarPark(x, y)) {
            return new Error(this._messenger.getMessage({
                msg: 'wrongMove'
            }));
        }

        // updetes the Bus's position
        this._setBusPosition(x, y, this._config.aDirections[f]);

        return this;
    };

    /**
     * To turn the Bus to the right, that is change its FACE
     * @return {Error|Bus}   If succsess it returs this, if not
     * success, it returns a corresponding Error instance
     */
    this.right = function() {
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));
        }
        this._oCurrentPosition.f =
            (this._oCurrentPosition.f + 1) > 3 ?
            0 : this._oCurrentPosition.f + 1;
        return this;
    };
	
    /**
     * To turn the Bus to the left, that is change its FACE
     * @return {Error|Bus}   If succsess it returs this, if not
     * success, it returns a corresponding Error instance
     */
    this.left = function() {
        if (!this._isFirstStepMade) {
            return new Error(this._messenger.getMessage({
                msg: 'noInitialCommand'
            }));
        }
        this._oCurrentPosition.f =
            (this._oCurrentPosition.f - 1) < 0 ?
            3 : this._oCurrentPosition.f - 1;
        return this;
    };
	
    /**
     * Send a message to a user
     * @param  {Object} msgObj {msg 'msgKey', [anyOtherKeys: ....]}
     * Possible keys are defined in the config.
     * @return {[type]}        [description]
     */
    this.report = function(msgObj) {
        // Call .report() without any parameters.
        if (!msgObj) {
            var oPosition = this._getBusPosition();

            // Very beginning, no any PLACE yet, coords are undefined
            // return a message "PLACE a Bus to begin", not coords
            if (oPosition.x == undefined &&
                oPosition.y == undefined &&
                oPosition.f == undefined) {
                return this._messenger.getMessage({
                    msg: 'placebusFirst'
                });
                // coords are defined, return Bus's position msg
            } else {
                return this._messenger.getMessage({
                    msg: 'busPosition',
                    x: oPosition.x,
                    y: oPosition.y,
                    f: oPosition.f
                });
            }
        } else
            return this._messenger.getMessage(msgObj);
    };
    
    /**
     * Send the current locatoion of the bus
     * @return {Object}  {x: correct-int-x, y: correct-int-y, f:
     * correct-FACE-word}. F is returned only UPPERCASED!
    */
    this.currentPosition = function () {
        var oPosition = this._getBusPosition();
        return  {
                    x: oPosition.x,
                    y: oPosition.y,
                    f: oPosition.f
                };
    };
	
    /**
     * Validate user input for PLACEX,Y,F command. X and Y should be INTs or a
     * String that can be converted to INT
     * @param   {INT|String} x x-coordinate
     * @param   {INT|String} y y-coordinate
     * @param   {String} f [NORTH, EAST, SOUTH, WEST]. Can
     * come either lowercased of uppercased
     * @return  {Object}  {x: correct-int-x, y: correct-int-y, f:
     * correct-FACE-word}. F is returned only UPPERCASED!
     * @private
     */
    this._validateInput = function(x, y, f) {

        // FACE cannot be undefined
        if (!f) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'noFace'
            }));
        }

        // FACE must be a string
        if (typeof f !== 'string') {
            throw new TypeError(this._messenger.getMessage({
                msg: 'faceNotString'
            }));
        }

        var _f = f.toUpperCase(),
            _x = parseInt(x),
            _y = parseInt(y);

        // Only either INT or Strings that can be parsed to INT are accepted as
        // coordinatres
        if (!Number.isInteger(_x) || !Number.isInteger(_y)) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'nonIntCoordinates'
            }));
        }

        // Only positive X and Y are accepted
        if (_x < 0 || _y < 0) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'noNegativeCoordinates'
            }));
        }

        // Only valid FACE words are accepted
        // 'NORTH', 'EAST', 'SOUTH', 'WEST'
        if (!this._isDirectionValid(_f)) {
            throw new TypeError(this._messenger.getMessage({
                msg: 'wrondDirection'
            }));
        }

        return {
            x: _x,
            y: _y,
            f: _f
        };
    };
	
    this._isCommandValid = function() {};

    /**
     * Check if FACE is a valid word, that is 'NORTH', 'EAST', 'SOUTH' or 'WEST'
     * @param   {String}  sFace 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
     * @return  {Boolean}
     * @private
     */
    this._isDirectionValid = function(sFace) {
        return this._config.aDirections.indexOf(sFace) !== -1;
    };
	
    /**
     * Update the Bus's position
     * @param   {INT} x x-coordinate
     * @param   {INT} y y-coordinate
     * @param   {String} f FACE, 'NORTH', 'EAST', 'SOUTH' or 'WEST' (uppercased)
     * @private
     */
    this._setBusPosition = function(x, y, f) {
        this._oCurrentPosition.x = x,
            this._oCurrentPosition.y = y,
            this._oCurrentPosition.f = this._config
            .aDirections.indexOf(f);
    };
	
    /**
     * Check if action is performed inside of the playground
     * @param   {INT}  x x-coordinate
     * @param   {INT}  y y-coordinate
     * @return  {Boolean}
     * @private
     */
    this._isOutOfcarPark = function(x, y) {
        return this.carPark.isOutOfcarPark(x, y);
    };
	
    /**
     * Getter.
     * @return  {Object} {x: int-x, y: int-y, f: FACE-word (uppercased)}
     * @private
     */
    this._getBusPosition = function() {
        return {
            x: this._oCurrentPosition.x,
            y: this._oCurrentPosition.y,
            f: this._config.aDirections[this._oCurrentPosition.f]
        }
    };
    
    /**
     * Getter.
     * @return  {Object} {x: int-x, y: int-y, f: FACE-word (uppercased)}
     * @private
     */
    this._resetBusPosition = function() {
        this._oCurrentPosition.x = undefined;
        this._oCurrentPosition.y = undefined;
        this._oCurrentPosition.f = undefined;
    };

    /**
     * These methods are for the sake of testing
     */
    this._getIsFirstStepMade = function() {
        return this._isFirstStepMade;
    };
	
    this._isFirstStepMadeFunc = function() {
        if (!this._isFirstStepMade) {
            return this.report({
                msg: 'noInitialCommand'
            });
        } else
            return true;
    };
	
    this._setIsFirstStepMade = function(val) {
        this._isFirstStepMade = val;
    };

    /**
     * Get Messenger instance
     * @return {Messenger} messenger instance
     * @public
     */
    this.getMessenger = function() {
        return this._messenger;
    };

}


module.exports = Bus;

