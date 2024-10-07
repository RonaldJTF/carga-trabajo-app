import { DateRangePipe } from "./date-range.pipe";

describe('DarkenColorPipe', () => {
    let pipe: DateRangePipe;

    beforeEach(() => {
        pipe = new DateRangePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    
    it('should format two dates in the same year with the same datetime type', () => {
        let input = ['2024-01-01 00:00:00', '2024-02-01 12:00:00'];
        let result = pipe.transform(input, 'datetime');
        expect(result).toBe("01 de enero 00:00:00 al 01 de febrero 12:00:00 del 2024")
    } )

    it('should format two dates in the same year', () => {
        let input = ['2024-10-10', '2024-10-31'];
        let result = pipe.transform(input, 'date');
        expect(result).toBe("10 de octubre al 31 de octubre del 2024");
    })

    it('should format two times within the same day', () => {
        let input = ['2024-01-01 10:30:00','2024-01-01 18:00:00'];
        let result = pipe.transform(input,'time');
        expect(result).toBe("10:30:00 a 18:00:00");
    })

    it('should format two dates in different years with the same datetime type', () => {
        let input = ['2023-01-01 00:00:00', '2024-01-10 11:00:00'];
        let result = pipe.transform(input, 'datetime');
        expect(result).toBe("01 de enero del 2023 00:00:00 al 10 de enero del 2024 11:00:00");
    })

    it('should format two dates in different years', () => {
        let input = ['2023-12-30', '2024-02-02'];
        let result = pipe.transform(input, 'date');
        expect(result).toBe("30 de diciembre al 02 de febrero del 2023");
    })
})