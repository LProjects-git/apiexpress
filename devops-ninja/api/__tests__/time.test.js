const { getNextArrival } = require('../time');

describe('getNextArrival', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-10-06T12:00:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns HH:MM + 3 minutes when headway = 3', () => {
    const result = getNextArrival(3);
    expect(result).toBe('12:03');
  });

  it('returns HH:MM + 3 minutes when no headway is passed', () => {
    const result = getNextArrival();
    expect(result).toBe('12:03');
  });

  it('throws error when headway is invalid (≤ 0)', () => {
    expect(() => getNextArrival(0)).toThrow('Invalid headway');
    expect(() => getNextArrival(-5)).toThrow('Invalid headway');
  });
});