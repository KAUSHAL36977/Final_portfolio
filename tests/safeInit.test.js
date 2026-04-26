const test = require('node:test');
const assert = require('node:assert');
const UISystem = require('../js/ui-system.js');

test('UISystem.safeInit', async (t) => {
    await t.test('it executes the passed function successfully', () => {
        let executed = false;
        UISystem.safeInit(() => {
            executed = true;
        }, 'testTask');
        assert.strictEqual(executed, true);
    });

    await t.test('it catches errors and logs a warning', () => {
        const originalWarn = console.warn;
        let warnMessage = '';
        console.warn = (msg, err) => {
            warnMessage = `${msg} ${err}`;
        };

        const errorMessage = 'Triggered error';
        UISystem.safeInit(() => {
            throw new Error(errorMessage);
        }, 'failingTask');

        console.warn = originalWarn;

        assert.ok(warnMessage.includes('[SYSTEM] failingTask:'));
        assert.ok(warnMessage.includes(errorMessage));
    });
});
