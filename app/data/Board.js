export default class Board {
    constructor() {

    }
    static initBoard() {
        return '[1, 1, 1, 1, 1]';
    }
    static destroyItem(data, index) {
        return data[index] = 0;
    }
    static parse(data) {
        return JSON.parse(data);
    }
    static forFB(data) {
        return JSON.stringify(data);
    }
    static haveIWon(data) {
        return data.indexOf(1) === -1;
    }
}