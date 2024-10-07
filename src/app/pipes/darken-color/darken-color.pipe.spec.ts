import { Methods } from "@utils";
import { DarkenColorPipe } from "./darken-color.pipe";

describe('DarkenColorPipe', () => {
    let pipe: DarkenColorPipe;

    beforeEach(() => {
        pipe = new DarkenColorPipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should darken a color', () => {
        let color ="#ff0000";
        let darkenedColor = "#800000";
        spyOn(Methods, 'darkenColor').and.returnValue(darkenedColor);

        let result = pipe.transform(color);
        expect(result).toBe(darkenedColor);
        expect(Methods.darkenColor).toHaveBeenCalledWith(color, 0.5);
    })
})