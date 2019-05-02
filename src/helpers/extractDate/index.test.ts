import extractDate from '.';
test('extractDate from a date object into hours/minutes/seconds', () => {
    let AMDate: Date = new Date(1556789100 * 1000);
    expect(extractDate(AMDate)).toBe(`02:25:00 AM`);
    let PMDate: Date = new Date(1556772019128);
    expect(extractDate(PMDate)).toBe(`09:40:19 PM`);
});
