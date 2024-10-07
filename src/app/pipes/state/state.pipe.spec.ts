import { StatePipe } from "./state.pipe";

describe('StatePipe', () => {
    let pipe: StatePipe;

    beforeEach(() => {
        pipe = new StatePipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return an active value for state 1', () => {
        let input = {classStyle: 'active', value:'Activo'};
        let result = pipe.transform('1');
        expect(result).toEqual(input);
    })

    it('should return an active value for state true', () => {
        let input = {classStyle: 'active', value:'Activo'};
        let result = pipe.transform('true');
        expect(result).toEqual(input);
    })

    it('should return an active value for state 0', () => {
        let input = {classStyle: 'inactive', value:'Inactivo'};
        let result = pipe.transform('0');
        expect(result).toEqual(input);
    })

    it('should return an active value for state false', () => {
        let input = {classStyle: 'inactive', value:'Inactivo'};
        let result = pipe.transform('false');
        expect(result).toEqual(input);
    })

})