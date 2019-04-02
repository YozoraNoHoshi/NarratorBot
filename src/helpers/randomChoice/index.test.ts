import randomChoice from './index';

test('it should return a value from the array', () => {
    expect([1, 2, 3, 4, 5]).toContain(randomChoice([1, 2, 3, 4, 5]));
    expect(randomChoice([1])).toBe(1);
});
