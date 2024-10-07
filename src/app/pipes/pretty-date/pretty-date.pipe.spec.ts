import { PrettyDatePipe } from "./pretty-date.pipe";


describe('PrettyDatePipe', () => {
    let pipe: PrettyDatePipe;

    beforeEach(() => {
        pipe = new PrettyDatePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should format any given date with a datetime type', () => {
        let input = '2024-01-01 00:00:00';
        let result = pipe.transform(input, 'datetime');
        expect(result).toBe("01 de enero de 2024 00:00:00")
    })

    it('should format any given date', () => {
        let input = '2024-01-01';
        let result = pipe.transform(input, 'date');
        expect(result).toBe("01 de enero de 2024")
    })

    it('should format any given time type', () => {
        let input = '2024-01-01 12:30:00';
        let result = pipe.transform(input, 'time');
        expect(result).toBe("12:30:00")
    })

})