import { TimeNamePipe } from "./time-name.pipe";

describe('TimeNamePipe', () => {
    let pipe: TimeNamePipe;

    beforeEach(() => {
        pipe = new TimeNamePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return "shortName" if length is less than maximumLength', () => {
      let number = 5;
      let maximumLength = 10;
      let shortName = "ShortName";
      let largeName = "LargeName";

      let result = pipe.transform(number,maximumLength,shortName,largeName);
      expect(result).toBe(shortName);
    })

    it('should return "largeName" if length is greater than maximumLength', () => {
      let number = 15000;
      let maximumLength = 4;
      let shortName = "ShortName";
      let largeName = "LargeName";

      let result = pipe.transform(number,maximumLength,shortName,largeName);
      expect(result).toBe(largeName);
    })

    it('should return empty string when number is 0', () => {
      let number = 0;
      let maximumLength = 4;
      let shortName = "ShortName";
      let largeName = "LargeName";

      let result = pipe.transform(number,maximumLength,shortName,largeName);
      expect(result).toBe('');
    })

    it('should return empty string when number is an empty string', () => {
      let number = '';
      let maximumLength = 4;
      let shortName = "ShortName";
      let largeName = "LargeName";

      let result = pipe.transform(number,maximumLength,shortName,largeName);
      expect(result).toBe('');
    })
})