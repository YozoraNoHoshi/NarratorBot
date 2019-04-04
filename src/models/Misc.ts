import { EIGHT_BALL_RESPONSES, FLIP_RESPONSES } from '../responses';
import randomChoice from '../helpers/randomChoice';

class Misc {
    // returns the 8 ball response for the question
    static eightBall(message: string): string {
        if (!message.endsWith('?')) return "That doesn't look like a question.";
        return randomChoice(EIGHT_BALL_RESPONSES);
    }

    // flips a two sided coin and returns the result
    static flip(): string {
        return randomChoice(FLIP_RESPONSES);
    }

    // rolls a virtual X sided die and returns the result. input must be positive and an actual number
    static dieRoll(sides: string): string {
        if (sides.toLowerCase().includes('infinity')) return 'No.';
        let input: number = Number(sides) || 6;
        if (input < 0) return `Maybe try something higher than ${input}?`;
        let result = Math.ceil(Math.random() * input);
        return `You rolled a ${result} out of ${input}!`;
    }

    static thatWasALie(): string {
        return '... but that was a LIE!';
    }
}

export default Misc;
