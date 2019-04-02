import randomChoice from './index';

describe('it should return a value from the array', () => {
    expect([1, 2, 3, 4, 5]).toContain(randomChoice([1, 2, 3, 4, 5]));
    expect([1]).toContain([randomChoice([1])]);
});
