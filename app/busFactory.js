'use strict';

/**
 * Toy bus Factory
 * It assembles a bus instance, injects its dependencies.
 * The factory returns a bus instance.
 */

const carPark = require('./carPark');
const Messenger = require('./messenger');
const config = require('./config');
const Bus = require('./bus');

module.exports = new Bus(config.bus, new carPark(config.carPark), new Messenger(config.messenger));
