/**
 * Testing Messenger.
 * Making sure that it returns correct messages to Robot.
 * Messages in config.js  are file.
 */
const config = require('./../app/config');
const Messenger = require('./../app/messenger');


describe('Messenger', () => {
    let messenger, x, y, f, s;

    beforeAll(() => {
        messenger = new Messenger(config.messenger),
            x = 1, y = 2, f = 'south', s = 'sake';
    });

    /**
     * Testing ALL messages in config file in a loop.
     */
    function testItsInLoop(key) {
        it(['should output correct', key, 'message'].join(' '),
            () => {
                expect(messenger.getMessage({
                    msg: key,
                    x,
                    y,
                    f
                })).toEqual(messenger._constructMessage({
                    msg: key,
                    x,
                    y,
                    f
                }));

            });
    }

    /**
     * A loop by itself
     */
    for (const key in config.messenger.oMsgs) {
        testItsInLoop(key);
    }
});
