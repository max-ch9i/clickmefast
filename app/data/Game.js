import Board from './Board';

export default Game {
    constructor(player, opponent, initPlayers, onInit) {
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
        var refBoardPlayer = this.player.child('board');
        var refBoardOp = this.opponent.child('board');
        refBoardPlayer.on('value', updateBoard('current', this._boardSnapshots, '_snapshotBoardMy', refBoardPlayer));
        refBoardOp.on('value', updateBoard('opponent', this._boardSnapshots, '_snapshotBoardOp', refBoardOp));
    }
    updateBoard(side, snapshotCache, cacheEntry, refBoard) {
        return function(snapshot) {
            snapshotCache[cacheEntry] = snapshot;
            var data = Board.parse(snapshot.val());
            if (Board.haveIWon(data)) {
                refBoard.off();
                this.onVictory(side);
            } else {
                this.onBoardUpdate(side);
            }
        }.bind(this);
    }
    hit(index) {
        this.player.updateBoard(this._boardSnapshots['_snapshotBoardMy'].val());
    }
}