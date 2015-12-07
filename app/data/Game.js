import Board from './Board';

export default class Game {
    constructor(player, opponent, initPlayers) {
        if (initPlayers) {
            opponent.initForGame(player);
            player.initForGame();
        }
        this.player = player;
        this.opponent = opponent;
        this._boardSnapshots = {
            _snapshotBoardMy: null,
            _snapshotBoardOp: null
        };
    }
    initGame(onInit, onVictory, onBoardUpdate) {
        onInit.apply(this);
        this.onVictory = onVictory.bind(this);
        this.onBoardUpdate = onBoardUpdate.bind(this);
        var refBoardPlayer = this.player.getRef().child('board');
        var refBoardOp = this.opponent.getRef().child('board');
        refBoardPlayer.on('value', this.updateBoard('current', this._boardSnapshots, '_snapshotBoardMy', refBoardPlayer));
        refBoardOp.on('value', this.updateBoard('opponent', this._boardSnapshots, '_snapshotBoardOp', refBoardOp));
    }
    updateBoard(side, snapshotCache, cacheEntry, refBoard) {
        return function(snapshot) {
            snapshotCache[cacheEntry] = snapshot;
            var data = snapshot.val();
            if (Board.haveIWon(data)) {
                refBoard.off();
                this.onVictory(side);
            } else {
                this.onBoardUpdate(side, Board.parse(data));
            }
        }.bind(this);
    }
    hit(index) {
        this.player.updateBoard(this._boardSnapshots['_snapshotBoardMy'].val(), index);
    }
}