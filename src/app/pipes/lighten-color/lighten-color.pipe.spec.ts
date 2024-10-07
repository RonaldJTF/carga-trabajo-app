import { Methods } from "@utils";
import { LightenColorPipe } from "./lighten-color.pipe";


describe('LightenColorPipe', () => {
    let pipe: LightenColorPipe;

    beforeEach(() => {
        pipe = new LightenColorPipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should lighten a color', () => {
        let color = "#800000";
        let lightenColor ="#ff0000";
        spyOn(Methods, 'lightenColor').and.returnValue(lightenColor);

        let result = pipe.transform(color);
        expect(result).toBe(lightenColor);
        expect(Methods.lightenColor).toHaveBeenCalledWith(color, 0.5);
    })
})