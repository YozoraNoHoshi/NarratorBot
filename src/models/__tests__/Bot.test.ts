import Bot from '../Bot';
import { BOT_PREFIX } from '../../config';

test('Bot help', async () => {
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}help` })).toContain('You just called this command.');
});
