import createError from './index';

test('it should create an error with message and status keys', () => {
    let error: any = createError('An error', 417);
    expect(error).toHaveProperty('status', 417);
    expect(error).toHaveProperty('message', 'An error');
});
