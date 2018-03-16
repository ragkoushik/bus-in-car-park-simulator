'use strict';

module.exports = Messenger;

/**
 * The Messenger class, constructor
 * @param {object} config Messenger's config
 */
function Messenger(config) {
    this._config = config || {};
}

var prototype = {

    /**
     * Instruction for a Messenger what message is needed
     * @param  {object} oData - {msg: 'aMessageKey', x: 10, y: 20, f: 'north', anyKey: 'someKey'}
     * @return {string} - parsed message
     * @public
     */
    getMessage: function(oData) {
        /**
         * If no any parameters provided.
         * Return a default welcome message.
         */
        if (!oData) {
            return this._config.oMsgs['welcome'];
        }
        /**
         * If there is no such a message-key in our oMsgs config.
         * Return a default welcome message.
         */
        if (!this._config.oMsgs[oData.msg]) {
            return this._config.oMsgs['welcome'];
        }
        return this._constructMessage(oData);
    },

    /**
     * Parses message string from oMsgs config by replacing {keys}
     * @param  {object} oData {msg: 'aMessageKey', x: 10, y: 20, f: 'north', anyKey: 'someKey'}
     * @return {string} - parsed message
     * @private
     */
    _constructMessage: function(oData) {
        var oCombined = Object.assign({}, oData, this._config.oSubs),
            str;

        str = this._config.oMsgs[oCombined.msg].replace(
            /{(\w+)}/g,
            function(match, p) {
                return oCombined[p];
            });
        return str;
    }
};

Messenger.prototype = Object.create(prototype);
Messenger.prototype.constructor = Messenger;
