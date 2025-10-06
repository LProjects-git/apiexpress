const { nextTimeFromNow } = require('../time');

describe('nextTimeFromNow', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-10-06T12:00:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns HH:MM + 3 minutes when headway = 3', () => {
    const result = nextTimeFromNow(3);
    expect(result).toBe('12:03');
  });

  it('returns HH:MM + 3 minutes when no headway is passed', () => {
    const result = nextTimeFromNow();
    expect(result).toBe('12:03');
  });

  it('throws error when headway is invalid (≤ 0)', () => {
    expect(() => nextTimeFromNow(0)).toThrow('Invalid headway');
    expect(() => nextTimeFromNow(-5)).toThrow('Invalid headway');
  });
});