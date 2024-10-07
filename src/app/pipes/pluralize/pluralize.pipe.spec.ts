import { Pluralize } from "@utils";
import { PluralizePipe } from "./pluralize.pipe";

describe('PluralizePipe', () => {
    let pipe: PluralizePipe;

    beforeEach(() => {
        pipe = new PluralizePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should pluralize a word with a quantity greater than 1', () => {
      let word = 'cat';
      let quantity = 2;
      let pluralizedWord = 'cats';
      
      spyOn(Pluralize, 'transform').and.returnValue(pluralizedWord);

      let result = pipe.transform(word, quantity);
      expect(result).toBe(pluralizedWord);
    })

    it('should return an empty string if word is null', () => {
      let quantity = 2;
      let result = pipe.transform(null, quantity);
      expect(result).toBe('');
    })


})