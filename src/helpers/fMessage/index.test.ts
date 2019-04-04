import fMessage, { BOLD, UNDERLINE, BLOCK, ITALICS } from './index';

test('it should create a formatted message', () => {
    expect(fMessage('hi', BOLD, UNDERLINE)).toBe('__**hi**__');
    expect(fMessage('hi', BOLD, UNDERLINE, BLOCK)).toBe('```__**hi**__```');
    expect(fMessage('hi', BOLD, BLOCK, ITALICS)).toBe('```***hi***```');
});
