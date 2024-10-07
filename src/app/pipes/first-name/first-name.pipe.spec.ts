
import { FirstNamePipe } from "./first-name.pipe";


describe('FirstNamePipe', () => {
    let pipe: FirstNamePipe;

    beforeEach(() => {
        pipe = new FirstNamePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return the first name given the full name', () => {
        let result = pipe.transform('Juan Carlos Ramirez Sanchez', 'Anonimo');
        expect(result).toBe('Juan');
    })

    it('should return the first name given multiple names', () => {
        let result = pipe.transform('Juan Pedro José', 'Anonimo');
        expect(result).toBe('Juan');
    })

    it('should return the default value when the name is undefined', () => {
        let result = pipe.transform(undefined, 'Anonimo');
        expect(result).toBe('Anonimo');
    })

    it('should return the default value when the name is empty', () => {
        let result = pipe.transform('', 'Anonimo');
        expect(result).toBe('Anonimo');
    })

    it('should return the first name given only one name', () => {
        let result = pipe.transform('Juan', 'Anonimo');
        expect(result).toBe('Juan');
    })

})