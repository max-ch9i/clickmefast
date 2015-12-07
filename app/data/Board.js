export default class Board {
    static initBoard() {
        return '[1, 1, 1, 1, 1]';
    }
    static destroyItem(data, index) {
        var board = Board.parse(data);
        board[index] = 0;
        return board;
    }
    static parse(data) {
        return JSON.parse(data);
    }
    static forFB(data) {
        return JSON.stringify(data);
    }
    static fromFB(data) {
        return JSON.parse(data);
    }
    static haveIWon(data) {
        var board = Board.parse(data);
        return board.indexOf(1) === -1;
    }
}