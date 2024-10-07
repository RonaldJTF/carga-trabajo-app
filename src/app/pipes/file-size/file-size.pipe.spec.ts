import { FileSizePipe } from "./file-size.pipe";


describe('FileSizePipe', () => {
    let pipe: FileSizePipe;

    beforeEach(() => {
        pipe = new FileSizePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return the value when the file size is less than 1000 Bytes', () => {
        let input = '900';
        let result = pipe.transform(input,'');
        expect(result).toBe('900 B');
    })

    it('should return the value when the file size is greater than 1000 Bytes and less than 1000000 Bytes', () => {
        let input = '9000';
        let result = pipe.transform(input,'');
        expect(result).toBe('9.00 Kb');
    })

    it('should return the value when the file size is greater than 1000000 Bytes and less than 1000000000 Bytes', () => {
        let input = '9000000';
        let result = pipe.transform(input,'');
        expect(result).toBe('9.00 Mb');
    })


    it('should return the value when the file size is greater than 1000000000 Bytes and less than 1000000000000 Bytes', () => {
        let input = '9000000000';
        let result = pipe.transform(input,'');
        expect(result).toBe('9.00 Gb');
    })

    it('should return the value when the file size is greater than 1000000000000 Bytes and less than 1000000000000000 Bytes', () => {
        let input = '9000000000000';
        let result = pipe.transform(input,'');
        expect(result).toBe('9.00 Tb');
    })

    it('should return the value when the file size is greater than 1000000000000000 Bytes', () => {
        let input = '1000000000000000';
        let result = pipe.transform(input,'Exceeds size');
        expect(result).toBe('Exceeds size');
    })

})