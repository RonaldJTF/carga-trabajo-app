import { Methods } from "@utils";
import { FileIconPipe } from "./file-icon.pipe";


describe('FileIconPipe', () => {
    let pipe: FileIconPipe;

    beforeEach(() => {
        pipe = new FileIconPipe();
    })

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('should return the correct icon path for a valid mimetype', () => {
        // simular el método
        let mimetype = 'image/png';
        let iconPath = 'assets/content/images/type of files/img.png';
        spyOn(Methods, 'getExtensionOfMimetype').and.returnValue('png');

        let result = pipe.transform(mimetype);
        expect(result).toBe(iconPath);
    })

    it('should return the correct icon path for an unknown mimetype', () => {
        // simular el método
        let mimetype = 'unknown/type';
        let iconPath = 'assets/content/images/type of files/general-file.png';
        spyOn(Methods, 'getExtensionOfMimetype').and.returnValue(null);

        let result = pipe.transform(mimetype);
        expect(result).toBe(iconPath);
    })

    it('should handle empty mimetype', () => {
        let iconPath = 'assets/content/images/type of files/general-file.png';
        let result = pipe.transform('');
        expect(result).toBe(iconPath);
    })
})