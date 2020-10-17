import { EIGHT_BALL_RESPONSES, FLIP_RESPONSES } from '../responses';
import randomChoice from '../helpers/randomChoice';
import fMessage, { BOLD, ITALICS, BLOCK } from '../helpers/fMessage';
import { PrefixedMessage } from '../types';

class Misc {
  // returns the 8 ball response for the question
  static eightBall(message: PrefixedMessage): string {
    if (!message.noPrefix.endsWith('?')) return "That doesn't look like a question.";
    return fMessage(randomChoice(EIGHT_BALL_RESPONSES), BLOCK);
  }

  // flips a two sided coin and returns the result
  static flip(): string {
    return `flips a coin and... ${fMessage(randomChoice(FLIP_RESPONSES), BOLD, ITALICS)}!`;
  }

  // rolls a virtual X sided die and returns the result. input must be positive and an actual number
  static dieRoll(message: PrefixedMessage): string {
    if (message.noPrefix.toLowerCase().includes('infinity')) return 'No.';
    let input: number = Math.round(Number(message.noPrefix) || 100);
    if (input < 0) return `Maybe try something higher than ${input}?`;
    let result = Math.ceil(Math.random() * input);
    return `You rolled a ${result} out of ${input}!`;
  }

  static thatWasALie(): string {
    // should return either that was the truth or that was a lie depending on some arbitrary condition
    return '... but that was a LIE!';
  }
}

export default Misc;
