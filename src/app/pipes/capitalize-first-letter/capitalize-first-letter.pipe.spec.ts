import { CapitalizeFirstLetterPipe } from './capitalize-first-letter.pipe';

describe('CapitalizeFirstLetterPipe', () => {
  let pipe: CapitalizeFirstLetterPipe;

    beforeEach(() => {
        pipe = new CapitalizeFirstLetterPipe();
    })
  
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize first letter', () => {
    expect(pipe.transform('abc')).toBe('Abc')
  })

  it('should capitalize first letter from every word', () => {
    expect(pipe.transform('abc def ghi')).toBe('Abc Def Ghi')
  })
});
