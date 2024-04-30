import { TimeNamePipe } from './time-name.pipe';

describe('TimeNamePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeNamePipe();
    expect(pipe).toBeTruthy();
  });
});
