import { ValidityPipe } from './validity.pipe';

describe('ValidityPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidityPipe();
    expect(pipe).toBeTruthy();
  });
});
