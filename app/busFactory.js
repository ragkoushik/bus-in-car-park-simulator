'use strict';

/**
 * Toy bus Factory
 * It assembles a bus instance, injects its dependencies.
 * The factory returns a bus instance.
 */

var carPark = require('./carPark');
var Messenger = require('./messenger');
var config = require('./config');
var Bus = require('./bus');

module.exports = new Bus(config.bus, new carPark(config.carPark), new Messenger(config.messenger));
