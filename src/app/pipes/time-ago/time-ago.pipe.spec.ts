import { TimeAgoPipe } from "./time-ago.pipe";


describe('TimeAgoPipe', () => {
    let pipe: TimeAgoPipe;

    beforeEach(() => {
        pipe = new TimeAgoPipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return "Hace un momento" when time difference is less than 60 seconds', () => {
      let date = new Date();
      let result = pipe.transform(date.toISOString());
      expect(result).toBe('Hace un momento');
    })

    it('should return the correct minutes difference', () => {
      let date = new Date();
      date.setMinutes(date.getMinutes() - 30);
      let result = pipe.transform(date.toISOString());
      expect(result).toBe("Hace 30 minutos");
    })    

    it('should return the correct hours difference', () => {
      let date = new Date();
      date.setHours(date.getHours() - 3);
      let result = pipe.transform(date.toISOString());
      expect(result).toBe("Hace 3 horas");
    }) 

    it('should return the correct days difference', () => {
      let date = new Date();
      date.setDate(date.getDate() - 2);
      let result = pipe.transform(date.toISOString());
      expect(result).toBe("Hace 2 días");
    }) 

    it('should return the correct days difference', () => {
      let date = new Date();
      date.setMonth(date.getMonth() - 2);
      let result = pipe.transform(date.toISOString());
      expect(result).toBe("Hace 2 meses");
    }) 

    it('should return the correct days difference', () => {
      let date = new Date();
      date.setFullYear(date.getFullYear() - 2);
      let result = pipe.transform(date.toISOString());
      expect(result).toBe("Hace 2 años");
    }) 

})