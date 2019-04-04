import { FLIP_RESPONSES, EIGHT_BALL_RESPONSES } from '../../responses';
import Misc from '../Misc';

test('Bot flip', () => {
    expect(FLIP_RESPONSES).toContain(Misc.flip());
});
test('Bot 8ball', () => {
    expect(EIGHT_BALL_RESPONSES).toContain(Misc.eightBall('What is life?'));
    expect(Misc.eightBall(`what is life`)).toBe("That doesn't look like a question.");
});
test('Bot die roll', () => {
    expect(Misc.dieRoll()).toContain('You rolled a');
    expect(Misc.dieRoll('-1')).toBe('Maybe try something higher than -1?');
    expect(Misc.dieRoll('Infinity')).toBe('No.');
});
