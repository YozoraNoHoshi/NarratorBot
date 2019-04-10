import randomInt from './index';

test('it should return random value between two numbers', () => {
    let random = randomInt(0, 3);
    expect(random).toBeLessThan(3);
    expect(random).toBeGreaterThanOrEqual(0);
    random = randomInt(1, 5);
    expect(random).toBeLessThan(5);
    expect(random).toBeGreaterThanOrEqual(1);
});

test('it should return random value between 0 and a number', () => {
    let random = randomInt(5);
    expect(random).toBeLessThan(5);
    expect(random).toBeGreaterThanOrEqual(0);
});
