import * as path from 'path';

class Utils {
    /*
    * @return {string} icon path
    * */
    public static getWhiteIcon(): string {
        return path.join(__dirname, './assets/icons/png/16x16-white.png');
    }
    /*
    * @return {string} icon path
    * */
    public static getDarkIcon(): string {
        return path.join(__dirname, './assets/icons/png/16x16.png');
    }
}

export default Utils
